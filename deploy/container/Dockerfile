# Offline rebuild: the package includes precompiled Linux amd64/arm64 servers.
# Build from the generated portable package, not the repository root.
FROM scratch
ARG TARGETARCH
ARG GAME_VERSION=0.89
ARG GAME_RELEASE
ARG SOURCE_COMMIT
COPY --chmod=0555 binaries/game-server-linux-${TARGETARCH} /game-server
COPY site/ /site/
COPY licenses/ /licenses/
LABEL org.opencontainers.image.title="长路未尽" \
      org.opencontainers.image.version="${GAME_VERSION}" \
      game.release="${GAME_RELEASE}" \
      org.opencontainers.image.revision="${SOURCE_COMMIT}"
USER 65532:65532
WORKDIR /
ENV GOMEMLIMIT=192MiB GOMAXPROCS=2
EXPOSE 8080
STOPSIGNAL SIGTERM
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD ["/game-server", "-healthcheck"]
ENTRYPOINT ["/game-server"]
CMD ["-root", "/site", "-listen", ":8080"]
