FROM alpine:3.9

RUN apk upgrade --no-cache
RUN apk add --no-cache nginx curl

RUN addgroup --gid 5000 nginx && nginx -u 5000} -S nginx -G nginx
RUN mkdir -p /var/log/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && mkdir -p /run/nginx && \
    chown -R nginx:nginx /run/nginx
COPY rootfs /

EXPOSE 8080
HEALTHCHECK --interval=5s --timeout=5s --start-period=120s CMD curl --fail http://localhost:8080/ || exit 1

CMD ["/usr/sbin/nginx","-g", "daemon off;"]