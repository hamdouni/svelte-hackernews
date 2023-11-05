#!/bin/bash
#
# Bump Version Number
#

VERSIONFILE=VERSION

if [ ! -f $VERSIONFILE ]; then
    echo "0.0.0" > $VERSIONFILE
fi

BASE_STRING=`cat $VERSIONFILE`
BASE_LIST=(`echo $BASE_STRING | tr '.' ' '`)
V_MAJOR=${BASE_LIST[0]}
V_MINOR=${BASE_LIST[1]}
V_PATCH=${BASE_LIST[2]}
echo "Current version : $BASE_STRING"
V_PATCH=$((V_PATCH + 1))
SUGGESTED_VERSION="$V_MAJOR.$V_MINOR.$V_PATCH"
read -p "Enter a version number [$SUGGESTED_VERSION]: " INPUT_STRING
if [ "$INPUT_STRING" = "" ]; then
    INPUT_STRING=$SUGGESTED_VERSION
fi
echo "Will set new version to be $INPUT_STRING"
echo $INPUT_STRING > $VERSIONFILE

echo "Will change version in service worker"
sed -i "s|const version = '.*';|const version = '$INPUT_STRING';|g" public/sw.js

git commit -a -m "$INPUT_STRING"
git tag -a -m "Tagging version $INPUT_STRING" "v$INPUT_STRING"
