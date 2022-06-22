#!/bin/bash

set -eo pipefail

echo "INTEGRATION_TEST=true" >> .env

cd ./ios/

set -o pipefail &&  xcodebuild -workspace example.xcworkspace \
            -scheme example \
            -sdk iphonesimulator \
            -destination platform=iOS\ Simulator,OS=15.2,name=iPhone\ 13 \
            clean test | xcpretty
cd ../

rm -rf .env
