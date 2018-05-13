#!/bin/bash
cd assets && npm run install && npm run tsc && cd ..
JEYKLL_ENV=prod bundle exec jekyll build

