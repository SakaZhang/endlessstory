# 长路未尽 · v0.89 便携容器

离线便携包包含同一份冻结游戏发布的 **Linux amd64（Intel/AMD）与 arm64（ARM64）** 镜像。不需要 Node.js、不需要构建游戏、不需要拉取基础镜像，也不需要登录镜像仓库；下述公开 Docker Hub 方式不需要登录即可拉取。包内有可 `docker load` 的镜像、Compose、预编译服务器、完整静态站点和离线 Docker 重建上下文。

精确 release、源码 commit、镜像 tag、image ID、编译器和文件数见 `PACKAGE-INFO.json`；`SHA256SUMS` 校验本包每个文件。两个架构共享同一静态资源层；源码推送状态以最终交付说明为准。

## 1. 推荐：从公开 Docker Hub 拉取

目标镜像：**`saka6/endlessstory:v0.89`**，计划提供 Linux amd64 与 arm64，由 Docker 按服务端架构选择。

**发布状态：待推送及核验，尚不能凭本文件认定 v0.89 已发布。** 以下是正式发布后使用的命令；实际可用状态与精确 registry digest 以最终交付说明为准。不要用旧 `v0.76`、`v0.77`、`v0.78`、`v0.79`、`v0.80` 或 `latest` 冒充新版；发布新版不覆盖这些 tag。

目标机器需已有 Docker Engine / Docker Desktop 的 Linux containers。公开镜像可以匿名拉取；不需要 `docker login`，也不要把密码/token 写入命令、Compose、镜像或聊天。以下命令按本次已确认的公网端口 **18888** 部署（映射所有宿主机接口，需自行确认防火墙/安全组放行）：

```sh
docker pull saka6/endlessstory:v0.89
docker image inspect saka6/endlessstory:v0.89 --format '{{json .RepoDigests}}'
# 保存返回的 registry digest；生产环境可改用最终交付的 saka6/endlessstory@sha256:<digest> 固定内容。
docker run -d --name changlu-weijin-v086 --restart unless-stopped \
  --pull never --user 65532:65532 --read-only --cap-drop ALL \
  --security-opt no-new-privileges:true --pids-limit 64 --memory 256m \
  --stop-timeout 15 --log-driver json-file --log-opt max-size=10m --log-opt max-file=3 \
  -p 18888:8080 saka6/endlessstory:v0.89
docker inspect --format '{{.State.Health.Status}}' changlu-weijin-v086
curl -fsS http://127.0.0.1:18888/healthz
```

healthcheck 启动期间可能显示 `starting`；待其成为 `healthy`，目标服务器可打开 **http://120.77.172.154:18888**（实际远程启动、端口放行及可访问性需在目标机核验）。若旧容器占用端口，请先保留需要的存档，再自行选择停旧容器或更换宿主端口；上述命令不会自动替换/删除旧容器。继续使用相同协议、域名/IP 和端口时，浏览器存档空间不变；本次不需要迁移存档，详见第 3 节。

公开镜像可由任何人拉取；镜像仓库不为运行后的游戏提供登录鉴权。上面的公网端口同样没有登录保护。域名、HTTPS、访问权限仍需自行配置，见第 2 节。

已有本便携包时，也可在手动 `docker pull` 后，用 `CHANGLU_IMAGE=saka6/endlessstory:v0.89 docker compose up -d --pull never --wait --wait-timeout 90` 复用随附的安全配置（Compose 默认仍只监听 `127.0.0.1:8080`；要复现本次公网端口，请明确设置 `BIND_ADDRESS=0.0.0.0 PORT=18888`）；不要再运行会加载离线 tag 的 `start.sh`。本包的离线 `changlu-weijin:0.89-<release前12位>-amd64/arm64` 标签及 Docker/OCI 清单保持独立，不等同于已推送的 Hub digest。

命令依据：[Docker pull](https://docs.docker.com/reference/cli/docker/image/pull/)、[Docker run](https://docs.docker.com/reference/cli/docker/container/run/)、[Compose up](https://docs.docker.com/reference/cli/docker/compose/up/)。

### 离线启动：无需 Docker Hub 登录

目标机器需已有 Docker Engine（或 Docker Desktop 的 Linux containers）和支持 `--wait` 的 Docker Compose v2。先核对外层归档旁的 SHA256，再解压：

```sh
tar -xzf changlu-v0.89-*-portable.tar.gz
cd changlu-portable
./start.sh
```

脚本会校验所有文件、识别 **Docker 服务端** 架构、加载两架构镜像、只启动匹配架构，并等待 healthcheck 成功。默认访问：**http://127.0.0.1:8080**。已有 `.env` 不会被默默覆盖；升级时如镜像 tag 不同，脚本会明确要求更新该行。

```sh
docker compose ps
docker compose logs --tail=50 game
curl -fsS http://127.0.0.1:8080/healthz
# 返回 ok
```

默认监听宿主机回环地址，不自动开放公网。部署在远程服务器时，可先从自己电脑用 SSH 隧道访问：

```sh
ssh -L 8080:127.0.0.1:8080 your-user@your-server
```

然后在自己电脑打开 `http://127.0.0.1:8080`。端口占用时，修改 `.env` 中 `PORT=8081` 后再运行 `./start.sh`。

## 2. 正式域名、HTTPS 和权限

**独立容器不继承原 Sites 的登录或访问权限。** 容器只提供 HTTP 静态游戏，没有用户登录、鉴权、多人服务器或数据库。

- 推荐由你已有的 Nginx/Caddy/Traefik/平台入口在外层终止 HTTPS，再代理到对应宿主端口（上面的公网部署为 `127.0.0.1:18888`，离线/Compose 默认是 `127.0.0.1:8080`）。容器内不放 TLS 私钥。
- 需要私有访问时，在反向代理或平台入口配置认证、访问名单或 VPN。不要因为原站是私有就认为新域名也私有。
- 推荐部署在独立域名根路径 `/`；未验证子目录前缀部署。代理必须原样保留 `/releases/<hash>/…`，不要把不存在的资源重写成首页。
- 保留服务器的 `Cache-Control`、`ETag`、`Vary: Accept-Encoding` 和 `Content-Encoding`；不要给首页强制一年缓存，也不要重复压缩 gzip 响应。
- `BIND_ADDRESS=0.0.0.0` 会暴露所有宿主机接口。只有你明确需要且已安排防火墙、HTTPS、权限时才修改；本包不会自动开放。
- 如果反向代理也在另一个容器，`127.0.0.1` 不指向游戏容器；应按你的代理拓扑接入同一 Docker 网络并代理 `game:8080`，不要盲目套用宿主机地址。

## 3. 存档：同源保留，跨域可手动迁移

**存档保存在浏览器 localStorage，按协议、域名和端口隔离；不在镜像或服务器磁盘里。** 本包没有任何个人存档，也没有自动迁移、同步或清空行为。容器更新/重启本身不会搬走浏览器的存档。

本次目标地址为 `http://120.77.172.154:18888`，不要求从 Sites 迁移存档。若你另外需要迁移旧存档，可选择以下步骤；没有旧存档或不需要迁移时，直接开始游戏即可。

1. 在原站打开“设置”，用存档导出功能保存 JSON，保留原始备份。Sites 地址是 `https://starlit-grove-saka.zhangsaka666.chatgpt.site`。
2. 在新站确认运行相同版本（本包 v0.89；最好核对 `release-integrity.json` 的 release），打开“设置”，手动导入备份 JSON。
3. 核对角色、装备、任务和进度后再继续游戏；不要为了迁移而清空旧站存档。

HTTP→HTTPS、换域名、换端口、换浏览器/设备都可能成为另一个存档空间。不要把存档 JSON 放进 `site/`、镜像或公开下载目录。

## 4. 手动加载/启动

```sh
sha256sum -c SHA256SUMS
docker load -i changlu-images.tar.gz
cat PACKAGE-INFO.json
# 从其中选择与 Docker 服务端匹配的 amd64 或 arm64 tag：
export CHANGLU_IMAGE=changlu-weijin:0.89-<release前12位>-amd64
docker compose up -d --pull never --wait --wait-timeout 90
```

如果没有 Compose，可用相同镜像直接运行（将 `<实际镜像tag>` 替换为上面的值）：

```sh
docker run -d --name changlu-weijin --restart unless-stopped \
  --user 65532:65532 --read-only --cap-drop ALL \
  --security-opt no-new-privileges:true --pids-limit 64 --memory 256m \
  --stop-timeout 15 -p 127.0.0.1:8080:8080 '<实际镜像tag>'
docker inspect --format '{{.State.Health.Status}}' changlu-weijin
```

`/healthz` 返回 200 表示静态发布已加载、HTTP 服务可用。它不等于用户完成了游戏浏览器回归。没有 shell/curl 的 scratch 容器使用内置 `/game-server -healthcheck`，不要尝试 `docker exec … sh`。

停止：`docker compose down`。升级：先备份需要保留的存档，换到新版本目录，核对 release 后重新运行。保留旧包可回滚镜像；跨版本存档兼容性不由容器自动保证，勿覆盖唯一备份。

## 5. 离线重建镜像（无需 Node 或 Go）

包内 `site/` 已是完整构建，`binaries/` 含两架构静态服务器。Dockerfile `FROM scratch` 不拉基础镜像：

```sh
RELEASE=$(python3 -c 'import json; print(json.load(open("PACKAGE-INFO.json"))["release"])')
SOURCE_COMMIT=$(python3 -c 'import json; print(json.load(open("PACKAGE-INFO.json"))["source_commit"])')
docker build --platform linux/amd64 \
  --build-arg GAME_VERSION=0.89 --build-arg GAME_RELEASE="$RELEASE" \
  --build-arg SOURCE_COMMIT="$SOURCE_COMMIT" \
  -t changlu-weijin:local-amd64 .
# ARM64 改为 --platform linux/arm64 与对应 tag
```

标准 Docker BuildKit 自动提供 TARGETARCH。需要更改服务器时，使用当前受支持、已修补的 Go 工具链（代码至少需要 Go 1.25），运行 `./rebuild-server.sh` 再重建镜像。它只用 Go 标准库，无外部 Go 模块；修改后原 `SHA256SUMS` 不再适用，必须重新生成/核验分发包。游戏逻辑更改需要回到完整项目构建，不能只改镜像 label 冒充新 release。

## 6. 缓存与安全默认值

- `/` 和根 HTML：`no-cache`，以 ETag 验证，避免旧入口混用新资源。
- `/release-integrity.json`：`no-store`，用于核对发布版本。
- `/releases/<64位sha256>/…`：一年 `immutable`；内容变化必须换 release 路径。
- 文本预压缩 gzip，按 Accept-Encoding（含 `q=0`）协商；有 `Vary`，不同编码有不同 ETag。原始 PNG 未改像素。
- HEAD、Range、If-Range、304 交由 Go `net/http.ServeContent`。不列目录、不回退不存在资源、不提供写入 API；拒绝点路径、隐藏路径和符号链接。
- 进程 UID/GID `65532:65532`、端口 8080、只读根文件系统、所有 capabilities 移除、no-new-privileges、无宿主目录挂载。SIGTERM 有 10 秒优雅停止窗口，Compose 给 15 秒。
- 容器不需要 outbound 网络访问；镜像内没有包管理器、Node、shell、用户密码、API key 或 `.git/.openai`。

## 7. 已验证与未验证

可在目标机器复核：

```sh
python3 verify.py .       # SHA256、release、gzip、Docker/OCI 清单、层摘要/权限/内容
python3 smoke.py .        # 当前架构原生二进制 HTTP 测试；不是 Docker 测试
```

交付环境没有 Docker/Podman/容器守护进程，因此**未执行 `docker load` / `docker run`、真实容器只读挂载测试或 ARM64 运行测试**。归档按官方 Docker/Moby 与 OCI 格式生成并逐层复核；两架构 ELF 静态链接/架构已检查；Go HTTP 单元/race 测试和 Linux amd64 非 root 原生启动/HTTP/优雅停止已实测。目标 Docker 的最终验收以 `./start.sh` 成功、`docker compose ps` healthy 和实际浏览器打开为准。若目标运行时不接受归档，使用上面的离线 Dockerfile 重建，不需要重新构建游戏。

第三方声明与 Go BSD 许可见 `licenses/`。仓库未附游戏整体公开授权；此打包不新增素材或游戏的公开再分发授权。
