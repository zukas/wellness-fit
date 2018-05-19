# !/bin/bash

SITE_SOURCES=(
public/scripts/morpheus.js
public/scripts/web.common.js
)

LOGIN_SOURCES=(
public/scripts/web.common.js
)

SITE_LIST="${SITE_SOURCES[*]}"
LOGIN_LIST="${LOGIN_SOURCES[*]}"

java -jar compiler.jar --js_output_file=public/compiled/web.min.js $SITE_LIST
java -jar compiler.jar --js_output_file=public/compiled/web.user.min.js $LOGIN_LIST
cleancss -o public/css/style-min.css public/css/style.css
