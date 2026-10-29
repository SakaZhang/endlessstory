# Container archive design and verification

The deterministic archive is both a Docker `manifest.json` archive and an OCI
image-layout v1.0.0 archive. Each platform has a distinct tag, config and runtime
layer. The static release/licensing layer is shared, so both architectures do
not duplicate the ~90 MiB game assets. No daemon, registry, third-party image or
base filesystem is required to create it.

- `manifest.json`: array with `Config`, `RepoTags`, ordered `Layers`. These refer
  to real archive files under `blobs/sha256/` (Moby's supported load schema).
- `oci-layout`: `{ "imageLayoutVersion": "1.0.0" }`.
- `index.json`: OCI v1 image index descriptors for Linux amd64 and arm64 with
  platform and image-name/tag annotations.
- Config has OS/architecture, numeric nonroot user, entrypoint, port, healthcheck,
  stop signal, content-release label, and `rootfs.diff_ids`.
- Layer blobs are **uncompressed** tar files. Therefore each layer descriptor
  digest and config DiffID are the same SHA256. Only the outer archive is gzip.
- Files are owned 0:0; static files 0444, executable 0555, image directories 0555.
  No symlinks, hardlinks, devices, setuid or world-writable files are emitted.
- Config SHA256 is the Docker image ID. OCI manifest SHA256 is separately listed;
  neither is falsely presented as a pushed registry digest.
- File timestamps and outer gzip mtime are zero; created time is the Unix epoch,
  deliberately not a claim of wall-clock creation time. The precise game content
  identity remains the release SHA256. Repeated builds with identical toolchain,
  sources, inputs and compression implementation produce identical archives.

Primary references used to implement/check this layout:

1. [Docker image load](https://docs.docker.com/reference/cli/docker/image/load/)
   documents loading tar archives, including gzip-compressed archives.
2. [Moby v28.0.0 load.go](https://github.com/moby/moby/blob/v28.0.0/image/tarexport/load.go)
   reads manifest.json, then Config, checks layer count/order and actual DiffIDs,
   creates the image configuration and restores RepoTags.
3. [Moby v28.0.0 save.go](https://github.com/moby/moby/blob/v28.0.0/image/tarexport/save.go)
   emits blobs/sha256, Docker manifest.json and OCI index/layout together.
4. [OCI image configuration v1.1.0](https://github.com/opencontainers/image-spec/blob/v1.1.0/config.md)
   defines image config fields, uncompressed DiffIDs, and config-based image IDs.
5. [OCI image layout v1.1.0](https://github.com/opencontainers/image-spec/blob/v1.1.0/image-layout.md)
   defines the layout/index/blobs filesystem structure.
6. [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) and
   [Compose services](https://docs.docker.com/reference/compose-file/services/)
   define entrypoint, user, healthcheck and runtime restrictions.
7. [Go net/http](https://pkg.go.dev/net/http#ServeContent) provides HTTP serving,
   conditional requests and ranges; no custom HTTP parser is implemented.
8. [Go download manifest](https://go.dev/dl/?mode=json) was used to verify the
   downloaded compiler archive against its official SHA256. Supplied build:
   `go1.27.3.linux-amd64.tar.gz`, 70,588,678 bytes,
   `65efbc80fdc1fa2cd2631cad5b481777a68e8725f34e89f50fc6ac714e379b40`.

`verify.py` checks these structural/digest/content invariants independently.
That is not equivalent to testing Docker import/runtime execution. The delivery
machine has no Docker daemon; actual docker load/run and ARM64 execution remain
explicit target-environment checks, with the included offline Dockerfile fallback.
