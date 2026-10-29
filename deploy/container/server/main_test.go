package main

import (
	"bytes"
	"compress/gzip"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func fixture(t *testing.T) (*staticHandler, string) {
	t.Helper()
	dir := t.TempDir()
	versioned := "/releases/" + strings.Repeat("a", 64) + "/"
	for name, body := range map[string]string{"index.html": "<!doctype html><title>长路未尽</title>", "release-integrity.json": "{}", strings.TrimPrefix(versioned, "/") + "app.js": "console.log('0123456789');", strings.TrimPrefix(versioned, "/") + "app.css": "body{color:red}", strings.TrimPrefix(versioned, "/") + "assets/pixel.png": "PNGDATA", strings.TrimPrefix(versioned, "/") + "art.svg": "<svg></svg>"} {
		p := filepath.Join(dir, name)
		if e := os.MkdirAll(filepath.Dir(p), 0755); e != nil {
			t.Fatal(e)
		}
		if e := os.WriteFile(p, []byte(body), 0644); e != nil {
			t.Fatal(e)
		}
		if strings.HasSuffix(name, ".js") || name == "index.html" {
			var buf bytes.Buffer
			z := gzip.NewWriter(&buf)
			z.Write([]byte(body))
			z.Close()
			os.WriteFile(p+".gz", buf.Bytes(), 0644)
		}
	}
	h, e := newHandler(dir)
	if e != nil {
		t.Fatal(e)
	}
	t.Cleanup(func() { h.root.Close() })
	return h, versioned
}
func request(h http.Handler, method, p string, headers map[string]string) *httptest.ResponseRecorder {
	r := httptest.NewRequest(method, p, nil)
	for k, v := range headers {
		r.Header.Set(k, v)
	}
	w := httptest.NewRecorder()
	h.ServeHTTP(w, r)
	return w
}
func TestServing(t *testing.T) {
	h, p := fixture(t)
	cases := []struct{ url, mime, cache string }{{"/", "text/html; charset=utf-8", "no-cache"}, {"/index.html", "text/html; charset=utf-8", "no-cache"}, {"/release-integrity.json", "application/json", "no-store"}, {p + "app.js", "text/javascript; charset=utf-8", "public, max-age=31536000, immutable"}, {p + "app.css", "text/css; charset=utf-8", "public, max-age=31536000, immutable"}, {p + "assets/pixel.png", "image/png", "public, max-age=31536000, immutable"}, {p + "art.svg", "image/svg+xml", "public, max-age=31536000, immutable"}}
	for _, c := range cases {
		t.Run(c.url, func(t *testing.T) {
			w := request(h, "GET", c.url, nil)
			if w.Code != 200 || w.Header().Get("Content-Type") != c.mime || w.Header().Get("Cache-Control") != c.cache {
				t.Fatalf("%d %v", w.Code, w.Header())
			}
			if w.Header().Get("X-Content-Type-Options") != "nosniff" {
				t.Fatal("missing nosniff")
			}
		})
	}
}
func TestCompression(t *testing.T) {
	h, p := fixture(t)
	url := p + "app.js"
	plain := request(h, "GET", url, nil)
	for _, accept := range []string{"gzip", "gzip, deflate, br", "GZip;q=1", "br;q=1, *;q=1", "identity;q=0, gzip;q=0.5"} {
		t.Run(accept, func(t *testing.T) {
			w := request(h, "GET", url, map[string]string{"Accept-Encoding": accept})
			if w.Code != 200 || w.Header().Get("Content-Encoding") != "gzip" || w.Header().Get("Vary") != "Accept-Encoding" {
				t.Fatalf("%d %v", w.Code, w.Header())
			}
			z, e := gzip.NewReader(w.Body)
			if e != nil {
				t.Fatal(e)
			}
			b, e := io.ReadAll(z)
			z.Close()
			if e != nil || string(b) != plain.Body.String() {
				t.Fatal("gzip content mismatch")
			}
			if w.Header().Get("ETag") == plain.Header().Get("ETag") {
				t.Fatal("representations share etag")
			}
		})
	}
	for _, accept := range []string{"", "br", "gzip;q=0", "gzip;q=0, *;q=1", "gzip;q=wat", "gzip;q=0.2, identity;q=1"} {
		w := request(h, "GET", url, map[string]string{"Accept-Encoding": accept})
		if w.Code != 200 || w.Header().Get("Content-Encoding") != "" || w.Body.String() != plain.Body.String() || w.Header().Get("Vary") != "Accept-Encoding" {
			t.Fatalf("identity %q %d %v", accept, w.Code, w.Header())
		}
	}
	for _, accept := range []string{"identity;q=0, gzip;q=0", "*;q=0"} {
		if w := request(h, "GET", url, map[string]string{"Accept-Encoding": accept}); w.Code != 406 {
			t.Fatalf("expected 406 for %s", accept)
		}
	}
	if w := request(h, "GET", p+"app.css", map[string]string{"Accept-Encoding": "identity;q=0, gzip;q=1"}); w.Code != 406 {
		t.Fatal("missing encoding should 406")
	}
}
func TestHeadRangeAndValidators(t *testing.T) {
	h, p := fixture(t)
	url := p + "app.js"
	get := request(h, "GET", url, nil)
	etag := get.Header().Get("ETag")
	head := request(h, "HEAD", url, nil)
	if head.Code != 200 || head.Body.Len() != 0 || head.Header().Get("Content-Length") != get.Header().Get("Content-Length") {
		t.Fatalf("head %v", head)
	}
	cached := request(h, "GET", url, map[string]string{"If-None-Match": etag})
	if cached.Code != 304 || cached.Body.Len() != 0 {
		t.Fatal("etag 304 failed")
	}
	stale := request(h, "GET", url, map[string]string{"If-None-Match": "\"old-version\""})
	if stale.Code != 200 {
		t.Fatal("stale etag")
	}
	ranged := request(h, "GET", url, map[string]string{"Range": "bytes=0-6"})
	if ranged.Code != 206 || ranged.Body.String() != "console" || ranged.Header().Get("Content-Range") == "" {
		t.Fatalf("range %d %s", ranged.Code, ranged.Body)
	}
	invalid := request(h, "GET", url, map[string]string{"Range": "bytes=999-1000"})
	if invalid.Code != 416 {
		t.Fatal("range invalid")
	}
	many := request(h, "GET", url, map[string]string{"Range": "bytes=" + strings.Repeat("0-1,", 17) + "1-2"})
	if many.Code != 416 {
		t.Fatal("range bound")
	}
	ifRange := request(h, "GET", url, map[string]string{"Range": "bytes=0-6", "If-Range": etag})
	if ifRange.Code != 206 {
		t.Fatal("if range")
	}
	ifRange = request(h, "GET", url, map[string]string{"Range": "bytes=0-6", "If-Range": "\"old\""})
	if ifRange.Code != 200 {
		t.Fatal("if range changed")
	}
	gz := request(h, "GET", url, map[string]string{"Accept-Encoding": "gzip"})
	gh := request(h, "HEAD", url, map[string]string{"Accept-Encoding": "gzip"})
	if gh.Code != 200 || gh.Body.Len() != 0 || gh.Header().Get("Content-Encoding") != "gzip" {
		t.Fatal("gzip head")
	}
	gc := request(h, "GET", url, map[string]string{"Accept-Encoding": "gzip", "If-None-Match": gz.Header().Get("ETag")})
	if gc.Code != 304 || gc.Header().Get("Vary") != "Accept-Encoding" || gc.Body.Len() != 0 {
		t.Fatal("gzip 304")
	}
	gr := request(h, "GET", url, map[string]string{"Accept-Encoding": "gzip", "Range": "bytes=0-4"})
	if gr.Code != 206 || !bytes.Equal(gr.Body.Bytes(), gz.Body.Bytes()[:5]) {
		t.Fatal("gzip encoded bytes range")
	}
	manifest := request(h, "GET", "/release-integrity.json", map[string]string{"If-None-Match": "*"})
	if manifest.Code != 200 || manifest.Header().Get("ETag") != "" {
		t.Fatal("manifest must not return cached response")
	}
}
func TestNoDirectoryTraversalOrWrites(t *testing.T) {
	h, p := fixture(t)
	for _, url := range []string{"/releases/", p, p + "assets/", "/.git/config", "/.openai/config", "/../index.html", "/%2e%2e/index.html", "/foo/../index.html", "/foo/%2E%2E/index.html", "//index.html", "/foo%5c..%5cindex.html", "/index.html.gz", "/does-not-exist"} {
		w := request(h, "GET", url, nil)
		if w.Code != 404 {
			t.Fatalf("%s got %d", url, w.Code)
		}
	}
	for _, method := range []string{"POST", "PUT", "DELETE", "OPTIONS"} {
		w := request(h, method, "/index.html", nil)
		if w.Code != 405 || w.Header().Get("Allow") != "GET, HEAD" {
			t.Fatal("writes enabled")
		}
	}
	health := request(h, "GET", "/healthz", nil)
	if health.Code != 200 || health.Body.String() != "ok\n" || health.Header().Get("Cache-Control") != "no-store" {
		t.Fatal("health")
	}
	health = request(h, "HEAD", "/healthz", nil)
	if health.Body.Len() != 0 || health.Header().Get("Content-Length") != "3" {
		t.Fatal("health head")
	}
}
func TestRejectSymlinksAndHiddenFiles(t *testing.T) {
	for _, name := range []string{".env", "symlink"} {
		t.Run(name, func(t *testing.T) {
			dir := t.TempDir()
			os.WriteFile(filepath.Join(dir, "index.html"), []byte("hi"), 0644)
			if name == "symlink" {
				os.Symlink("/etc/passwd", filepath.Join(dir, name))
			} else {
				os.WriteFile(filepath.Join(dir, name), []byte("secret"), 0644)
			}
			if h, e := newHandler(dir); e == nil {
				h.root.Close()
				t.Fatal("unsafe tree accepted")
			}
		})
	}
}

func TestHealthcheckClient(t *testing.T) {
	h, _ := fixture(t)
	s := httptest.NewServer(h)
	defer s.Close()
	if err := healthcheck(strings.TrimPrefix(s.URL, "http://")); err != nil {
		t.Fatal(err)
	}
	bad := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { http.Error(w, "bad", 503) }))
	defer bad.Close()
	if err := healthcheck(strings.TrimPrefix(bad.URL, "http://")); err == nil {
		t.Fatal("unhealthy accepted")
	}
}

func TestErrorResponsesAreNotGzipOrImmutable(t *testing.T) {
	h, p := fixture(t)
	url := p + "app.js"
	tooMany := request(h, "GET", url, map[string]string{"Accept-Encoding": "gzip", "Range": "bytes=" + strings.Repeat("0-1,", 17) + "1-2"})
	if tooMany.Code != 416 || tooMany.Header().Get("Content-Encoding") != "" || tooMany.Header().Get("Cache-Control") != "no-store" || tooMany.Header().Get("ETag") != "" {
		t.Fatalf("invalid range error headers: %v", tooMany.Header())
	}
	if err := h.root.Remove(strings.TrimPrefix(url, "/") + ".gz"); err != nil {
		t.Fatal(err)
	}
	missing := request(h, "GET", url, map[string]string{"Accept-Encoding": "gzip"})
	if missing.Code != 404 || missing.Header().Get("Content-Encoding") != "" || missing.Header().Get("Cache-Control") != "no-store" {
		t.Fatalf("missing gzip headers: %v", missing.Header())
	}
}
