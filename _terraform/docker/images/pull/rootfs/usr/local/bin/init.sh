#!/bin/bash

set -e

/usr/local/bin/pull.sh

exec /usr/local/bin/supercronic /crontab
