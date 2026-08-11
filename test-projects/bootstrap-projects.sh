#!/bin/bash

set -e

for DIR in "next-gdg" "cra5-gdg"
do
    pushd $DIR
    npm install
    rm -rf node_modules/@glideappsfinal/glide-data-grid
    ln -s ../../../../packages/core/ node_modules/@glideappsfinal/glide-data-grid
    popd
done