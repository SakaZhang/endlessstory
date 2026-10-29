// Static, read-only game server. HTTP parsing, ranges and validators use net/http.
package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"flag"
	"fmt"
	"io"
	"io/fs"
	"log"
	"mime"
	"net/http"
	"os"
	"os/signal"
	"path"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"syscall"
	"time"
)

type asset struct {
	name, etag string
	size       int64
	mod        time.Time
}
type staticHandler struct {
	root  *os.Root
	files map[string]asset
}

var releasePath = regexp.MustCompile(`^/releases/[a-f0-9]{64}/.+`)

func newHandler(dir string) (*staticHandler, error) {
	// Explicit MIME mappings also work in scratch, without /etc/mime.types.
	for ext, typ := range map[string]string{
		".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
		".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
		".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
		".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
		".ico": "image/vnd.microsoft.icon", ".woff": "font/woff", ".woff2": "font/woff2",
		".wasm": "application/wasm", ".mp3": "audio/mpeg", ".ogg": "audio/ogg",
	} {
		if err := mime.AddExtensionType(ext, typ); err != nil {
			return nil, err
		}
	}
	root, err := os.OpenRoot(dir)
	if err != nil {
		return nil, err
	}
	h := &staticHandler{root: root, files: map[string]asset{}}
	err = filepath.WalkDir(dir, func(p string, d fs.DirEntry, e error) error {
		if e != nil {
			return e
		}
		if d.Type()&os.ModeSymlink != 0 {
			return fmt.Errorf("symlink forbidden: %s", p)
		}
		if d.IsDir() {
			return nil
		}
		if !d.Type().IsRegular() {
			return fmt.Errorf("non-regular file: %s", p)
		}
		rel, e := filepath.Rel(dir, p)
		if e != nil {
			return e
		}
		rel = filepath.ToSlash(rel)
		if !safePath("/" + rel) {
			return fmt.Errorf("unsafe asset path: %s", rel)
		}
		f, e := root.Open(rel)
		if e != nil {
			return e
		}
		defer f.Close()
		info, e := f.Stat()
		if e != nil {
			return e
		}
		sum := sha256.New()
		if _, e = io.Copy(sum, f); e != nil {
			return e
		}
		h.files["/"+rel] = asset{rel, `"` + hex.EncodeToString(sum.Sum(nil)) + `"`, info.Size(), info.ModTime()}
		return nil
	})
	if err == nil {
		if _, ok := h.files["/index.html"]; !ok {
			err = errors.New("missing index.html")
		}
	}
	if err != nil {
		root.Close()
		return nil, err
	}
	return h, nil
}

func safePath(p string) bool {
	if !strings.HasPrefix(p, "/") || strings.ContainsAny(p, "\\\x00") {
		return false
	}
	for _, part := range strings.Split(strings.TrimPrefix(p, "/"), "/") {
		if part == "" || strings.HasPrefix(part, ".") {
			return false
		}
	}
	return true
}

// Exact coding rules take precedence over '*'. An absent header uses identity.
func encodingQuality(value, coding string) float64 {
	if strings.TrimSpace(value) == "" {
		if coding == "identity" {
			return 1
		}
		return 0
	}
	explicit, wild := -1.0, -1.0
	for _, item := range strings.Split(value, ",") {
		parts := strings.Split(item, ";")
		name := strings.ToLower(strings.TrimSpace(parts[0]))
		q := 1.0
		for _, param := range parts[1:] {
			kv := strings.SplitN(strings.TrimSpace(param), "=", 2)
			if strings.EqualFold(kv[0], "q") {
				q = 0
				if len(kv) == 2 {
					if n, e := strconv.ParseFloat(strings.TrimSpace(kv[1]), 64); e == nil && n >= 0 && n <= 1 {
						q = n
					}
				}
			}
		}
		if name == coding {
			if explicit < 0 || q < explicit {
				explicit = q
			}
		}
		if name == "*" {
			if wild < 0 || q < wild {
				wild = q
			}
		}
	}
	if explicit >= 0 {
		return explicit
	}
	if coding == "identity" {
		if wild == 0 {
			return 0
		}
		return 1
	}
	if wild >= 0 {
		return wild
	}
	return 0
}

func (h *staticHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.Header().Set("Referrer-Policy", "same-origin")
	w.Header().Set("X-Frame-Options", "SAMEORIGIN")
	w.Header().Set("Cache-Control", "no-store")
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		w.Header().Set("Allow", "GET, HEAD")
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if r.URL.Path == "/healthz" {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Header().Set("Content-Length", "3")
		if r.Method == http.MethodGet {
			io.WriteString(w, "ok\n")
		}
		return
	}
	p := r.URL.Path
	if p == "/" {
		p = "/index.html"
	}
	if !safePath(p) || strings.HasSuffix(p, ".gz") {
		http.NotFound(w, r)
		return
	}
	a, ok := h.files[p]
	if !ok {
		http.NotFound(w, r)
		return
	}
	original := a
	gzipAsset, hasGzip := h.files[p+".gz"]
	if hasGzip {
		w.Header().Set("Vary", "Accept-Encoding")
	}
	accept := strings.Join(r.Header.Values("Accept-Encoding"), ",")
	identity, gzipQ := encodingQuality(accept, "identity"), encodingQuality(accept, "gzip")
	encoded := false
	if hasGzip && gzipQ > 0 && gzipQ >= identity {
		a = gzipAsset
		encoded = true
	} else if identity <= 0 {
		http.Error(w, "no acceptable content encoding", http.StatusNotAcceptable)
		return
	}
	f, err := h.root.Open(a.name)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	defer f.Close()
	// Content hash remains valid only for the immutable packaged file set.
	if info, e := f.Stat(); e != nil || info.Size() != a.size || !info.ModTime().Equal(a.mod) {
		http.Error(w, "asset changed; restart required", http.StatusServiceUnavailable)
		return
	}
	// Bound multi-range work even when rebuilt with an older supported Go release.
	if len(r.Header.Get("Range")) > 4096 || strings.Count(r.Header.Get("Range"), ",") > 15 {
		http.Error(w, "too many ranges", http.StatusRequestedRangeNotSatisfiable)
		return
	}
	if encoded {
		w.Header().Set("Content-Encoding", "gzip")
	}
	cache := "no-cache"
	if releasePath.MatchString(p) {
		cache = "public, max-age=31536000, immutable"
	}
	if path.Base(p) == "release-integrity.json" {
		cache = "no-store"
	}
	w.Header().Set("Cache-Control", cache)
	if cache != "no-store" {
		w.Header().Set("ETag", a.etag)
	} else {
		// Integrity checks are always fresh, including clients sending wildcard validators.
		r = r.Clone(r.Context())
		for _, header := range []string{"If-Match", "If-None-Match", "If-Modified-Since", "If-Unmodified-Since", "If-Range"} {
			r.Header.Del(header)
		}
	}
	typ := mime.TypeByExtension(path.Ext(original.name))
	if typ == "" {
		typ = "application/octet-stream"
	}
	w.Header().Set("Content-Type", typ)
	// Build mtimes are deterministic. ETag, not Last-Modified, is authoritative across upgrades.
	http.ServeContent(w, r, original.name, time.Time{}, f)
}

func healthcheck(addr string) error {
	client := http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get("http://" + addr + "/healthz")
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	b, err := io.ReadAll(io.LimitReader(resp.Body, 4))
	if err != nil {
		return err
	}
	if resp.StatusCode != 200 || string(b) != "ok\n" {
		return fmt.Errorf("health status %d", resp.StatusCode)
	}
	return nil
}

func main() {
	addr := flag.String("listen", ":8080", "HTTP listen address")
	root := flag.String("root", "/site", "static release directory")
	check := flag.Bool("healthcheck", false, "check 127.0.0.1:8080 and exit")
	flag.Parse()
	if *check {
		if err := healthcheck("127.0.0.1:8080"); err != nil {
			log.Print(err)
			os.Exit(1)
		}
		return
	}
	h, err := newHandler(*root)
	if err != nil {
		log.Fatal(err)
	}
	defer h.root.Close()
	server := &http.Server{Addr: *addr, Handler: h, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 30 * time.Second, WriteTimeout: 60 * time.Second, IdleTimeout: 60 * time.Second, MaxHeaderBytes: 32 << 10}
	stopped := make(chan os.Signal, 1)
	signal.Notify(stopped, syscall.SIGTERM, os.Interrupt)
	done := make(chan struct{})
	go func() {
		<-stopped
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := server.Shutdown(ctx); err != nil {
			log.Printf("shutdown: %v", err)
		}
		close(done)
	}()
	log.Printf("serving immutable game release on %s (%d files)", *addr, len(h.files))
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(err)
	}
	<-done
}
