FROM ghcr.io/getzola/zola:v0.22.1 AS builder
WORKDIR /site
COPY . .
RUN ["zola", "build"]

FROM docker.io/library/nginx:alpine
COPY --from=builder /site/public /usr/share/nginx/html
EXPOSE 80
