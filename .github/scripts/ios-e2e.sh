#!/bin/bash

set -eo pipefail

cd ./example/ios/
E2ETEST=true xcodebuild -workspace example.xcworkspace \
            -scheme example \
            -sdk iphonesimulator \
            -destination platform=iOS\ Simulator,OS=15.4,name=iPhone\ 13 \
            clean test
cd ../../
