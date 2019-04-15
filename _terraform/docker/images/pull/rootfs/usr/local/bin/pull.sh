#!/bin/bash

set -e

echo "[default]
host_base = sos-${EXOSCALE_REGION}.exo.io
host_bucket = ${PULL_BUCKETURL}
access_key = ${EXOSCALE_KEY}
secret_key = ${EXOSCALE_SECRET}
use_https = True
" > ~/.s3cfg

s3cmd sync --delete-removed --host=${PULL_ENDPOINT} ${PULL_SOURCE} /var/www/htdocs

rm ~/.s3cfg

echo "last_pull $(date +%s)" > /srv/monitoring/last_pull.timestamp