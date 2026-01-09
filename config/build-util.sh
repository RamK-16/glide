run_in_parallel() {
  local funcs=("$@")
  local pids=()

  # Start the functions in the background and store their PIDs
  for func in "${funcs[@]}"; do
    ($func) &
    pids+=($!)
  done

  # Wait for all functions and exit if any of them fail
  for pid in "${pids[@]}"; do
    wait $pid || exit $?
  done
}

generate_index_css() {
  echo "/* Auto-generated file */" > dist/index.css
  find dist/esm -name '*.css' -print | sed 's/^dist\/esm\//\@import ".\/esm\//' | sed 's/$/";/' >> dist/index.css
}

ensure_bash_4() {
    # Check if bash version is 4+ or try to find newer version
    if [ "${BASH_VERSINFO[0]}" -lt 4 ]; then
        if [ -x "/opt/homebrew/bin/bash" ]; then
            exec /opt/homebrew/bin/bash "$0" "$@"
        elif [ -x "/usr/local/bin/bash" ]; then
            exec /usr/local/bin/bash "$0" "$@"
        else
            # Bash 4+ not found, but we can continue with bash 3.2
            # globstar is not actually needed as **/*.js is passed to wyw-in-js, not expanded by bash
            echo "Warning: Using bash ${BASH_VERSION}. Some features may not work, but build should continue."
        fi
    fi
}

remove_all_css_imports() {
    local directory=$1
    local sed_cmd="sed -i"

    # Check if sed is GNU sed or BSD sed
    if sed --version 2>/dev/null | grep -q GNU; then
        sed_cmd="sed -i"  # GNU sed
    else
        sed_cmd="sed -i ''"  # BSD sed
    fi

    # find "$directory" -type f -name "*.js" -exec bash -c "$sed_cmd \"/require('.\/.*\.css');/d\" {}" \;
    # find "$directory" -type f -name "*.js" -exec bash -c "$sed_cmd \"/require('.\/.*\.css');/d;/import \\\".*\.css\\\";/d\" {}" \;
    find "$directory" -type f -name "*.js" -exec bash -c "$sed_cmd \"/import \\\".*\.css\\\";/d\" {}" \;
}

compile() {
    tsc -p tsconfig.$1.json --outdir ./dist/$1-tmp --declarationDir ./dist/dts-tmp
    wyw-in-js -r dist/$1-tmp/ -m esnext -o dist/$1-tmp/ dist/$1-tmp/**/*.js -t -i dist/$1-tmp -c ../../config/linaria.json > /dev/null
    remove_all_css_imports dist/$1-tmp

    # replace dist/$1 (if it exists) with dist/$1-tmp
    if [ -d "dist/$1" ]; then
        mv dist/$1 dist/$1-remove
        rm -rf dist/$1-remove &
    fi
    mv dist/$1-tmp dist/$1

    

    # if it's esm, move the dts folder
    if [ "$2" = true ]; then
        if [ -d "dist/dts" ]; then
            mv dist/dts dist/dts-remove
            rm -rf dist/dts-remove &
        fi
        mv dist/dts-tmp dist/dts
    fi

    rm dist/tsconfig.$1.tsbuildinfo
}