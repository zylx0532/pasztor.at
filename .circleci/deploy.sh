#!/bin/bash

set -e

for NODE in $(dig +short all.cdn.opsbears.net); do
    echo "Deploying to ${NODE}..."
    rsync -az --delete ./_site/ deploy@$NODE:/srv/www/pasztor.at/htdocs/
done
