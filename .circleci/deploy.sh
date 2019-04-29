#!/bin/bash

pip3 install s3cmd
if [[ $? -ne 0 ]]; then
    exit $?
fi
echo "[default]
host_base = sos-${EXOSCALE_REGION}.exo.io
host_bucket = %(bucket)s.sos-${EXOSCALE_REGION}.exo.io
access_key = ${EXOSCALE_KEY}
secret_key = ${EXOSCALE_SECRET}
use_https = True
" > ~/.s3cfg
s3cmd sync --delete-removed ./_site/ deploy@$NODE:/srv/www/pasztor.at/htdocs/
RESULT=$?
rm ~/.s3cfg
exit ${RESULT}
