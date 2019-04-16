#!/bin/bash

set -e

echo "[default]
host_base = sos-${EXOSCALE_REGION}.exo.io
host_bucket = ${BACKUP_BUCKETURL}
access_key = ${EXOSCALE_KEY}
secret_key = ${EXOSCALE_SECRET}
use_https = True
" > ~/.s3cfg

s3cmd sync --host=${BACKUP_ENDPOINT} /srv/acme/ ${ACME_BACKUP_DEST}
s3cmd sync --host=${BACKUP_ENDPOINT} /srv/prometheus/ ${PROMETHEUS_BACKUP_DEST}
s3cmd sync --host=${BACKUP_ENDPOINT} /srv/grafana/ ${GRAFANA_BACKUP_DEST}

rm ~/.s3cfg

echo "last_backup $(date +%s)" > /srv/monitoring/last-backup.timestamp
