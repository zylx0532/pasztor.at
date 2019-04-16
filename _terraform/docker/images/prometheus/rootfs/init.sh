#!/bin/sh

set -e

# Restore prometheus data from backup
if [ ! -d /prometheus/data/ ]; then
    echo "[default]
host_base = sos-${EXOSCALE_REGION}.exo.io
host_bucket = ${BACKUP_BUCKETURL}
access_key = ${EXOSCALE_KEY}
secret_key = ${EXOSCALE_SECRET}
use_https = True
" > ~/.s3cfg
    s3cmd sync --host=${BACKUP_ENDPOINT} ${BACKUP_DEST} /prometheus
    rm ~/.s3cfg
fi

exec /bin/prometheus $*
