#!/bin/sh
set -eu
cd "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
# A supported Go toolchain is required only when changing the server source.
# No Go modules are downloaded: this server uses the standard library only.
GO=${GO:-go}
"$GO" version
mkdir -p binaries
(cd server && GOTOOLCHAIN=local "$GO" test ./...)
for arch in amd64 arm64; do
  (cd server && CGO_ENABLED=0 GOOS=linux GOARCH="$arch" GOTOOLCHAIN=local "$GO" build -trimpath -buildvcs=false -ldflags='-s -w -buildid=' -o "../binaries/game-server-linux-$arch" .)
done
