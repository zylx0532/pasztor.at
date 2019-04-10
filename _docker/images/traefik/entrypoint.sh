#!/bin/sh
set -e

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
    set -- traefik "$@"
fi

# if our command is a valid Traefik subcommand, let's invoke it through Traefik instead
# (this allows for "docker run traefik version", etc)
if traefik "$1" --help | grep -s -q "help"; then
    set -- traefik "$@"
fi

# Restore certificates from S3 bucket
if [ ! -f /etc/traefik/acme/acme.json ]; then
    echo "[default]
host_base = sos-${EXOSCALE_REGION}.exo.io
host_bucket = ${BACKUP_BUCKETURL}
access_key = ${EXOSCALE_KEY}
secret_key = ${EXOSCALE_SECRET}
use_https = True
" > ~/.s3cfg
    s3cmd sync --host=${BACKUP_ENDPOINT} ${BACKUP_DEST} /etc/traefik/acme
    rm ~/.s3cfg
fi

export EXOSCALE_KEY=
export EXOSCALE_SECRET=

exec "$@"