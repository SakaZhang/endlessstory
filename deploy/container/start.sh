#!/bin/sh
set -eu
cd "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
command -v docker >/dev/null 2>&1 || { echo '需要先安装 Docker Engine / Docker Desktop（Linux containers）。' >&2; exit 1; }
docker compose version >/dev/null
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum -c SHA256SUMS
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 -c SHA256SUMS
else
  echo '缺少 SHA256 校验工具：请安装 sha256sum 或 shasum；未校验不会启动。' >&2
  exit 1
fi
[ "$(docker info --format '{{.OSType}}')" = linux ] || { echo '需要 Docker Linux containers。' >&2; exit 1; }
arch=$(docker info --format '{{.Architecture}}')
case "$arch" in
  x86_64|amd64) arch=amd64 ;;
  aarch64|arm64) arch=arm64 ;;
  *) echo "不支持 Docker 服务端架构: $arch；仅包含 linux/amd64 和 linux/arm64。" >&2; exit 1 ;;
esac
# Both images are in one archive; their static game layer is shared.
docker load --input changlu-images.tar.gz
base=$(cat IMAGE_TAG_BASE)
image="$base-$arch"
docker image inspect "$image" >/dev/null
# Existing user configuration is never silently rewritten.
if [ -f .env ]; then
  saved=$(sed -n 's/^CHANGLU_IMAGE=//p' .env)
  [ "$saved" = "$image" ] || { printf '请先把 .env 中 CHANGLU_IMAGE 改成 %s，再运行 ./start.sh（其他配置不动）。\n' "$image" >&2; exit 1; }
else
  printf 'CHANGLU_IMAGE=%s\nBIND_ADDRESS=127.0.0.1\nPORT=8080\n' "$image" > .env
fi
CHANGLU_IMAGE="$image" docker compose up -d --pull never --wait --wait-timeout 90
printf '\n已启动并通过 Docker healthcheck。可运行 docker compose ps 查看。\n默认地址 http://127.0.0.1:8080；远程部署默认需 SSH 隧道或你已有的 HTTPS 反向代理。\n'
