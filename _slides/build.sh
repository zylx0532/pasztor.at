#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

{
    cd $DIR
    reveal-md \
        --theme _theme/style.css \
        --template _assets/_theme/template.html \
        --listing-template _assets/_theme/listing.html \
        --highlight-theme github-gist \
        --static ./../_site/slides/ \
        --static-dirs _assets \
        .
}
