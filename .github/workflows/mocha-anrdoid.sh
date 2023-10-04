#!/bin/bash

adb reverse tcp:8090 tcp:8090
adb reverse tcp:9090 tcp:9090
adb reverse tcp:9091 tcp:9091
adb reverse tcp:9092 tcp:9092
adb reverse tcp:9735 tcp:9735
adb reverse tcp:9736 tcp:9736
adb reverse tcp:9737 tcp:9737
adb reverse tcp:18080 tcp:18080
adb reverse tcp:28081 tcp:28081
adb reverse tcp:60001 tcp:60001

set +e
yarn test:mocha:android
EXIT_CODE=$?
set -e

echo $EXIT_CODE;
if [ $EXIT_CODE -ne 0 ]; then
    adb root
    sleep 10
    adb pull /data/user/0/com.exmpl/files/ldk/ artifacts/
fi

exit $EXIT_CODE
