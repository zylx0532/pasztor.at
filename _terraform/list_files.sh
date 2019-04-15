#!/bin/bash

cd ../_site/
find . -type f | sed -e 's/\.\///'
