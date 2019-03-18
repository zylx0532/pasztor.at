#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

{
    cd $DIR
    reveal-md \
        --theme _theme/style.css \
        --template _theme/template.html \
        --listing-template _theme/listing.html \
        --highlight-theme github-gist \
        $1/slides.md
}
