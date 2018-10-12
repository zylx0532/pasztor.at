#!/bin/bash

set -e

for NODE in $(dig +short all.cdn.opsbears.net); do
    echo "Deploying to ${NODE}..."
    rsync -e "ssh" --rsync-path="sudo rsync" -az --delete ./_site/ $NODE:/srv/www/pasztor.at/htdocs/
done
