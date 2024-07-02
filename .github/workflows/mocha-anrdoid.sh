#!/bin/bash

adb root
adb reverse tcp:3003 tcp:3003
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
adb shell date `date +%m%d%H%M%G.%S`

set +e
yarn test:mocha:android
EXIT_CODE=$?
set -e

echo $EXIT_CODE;
if [ $EXIT_CODE -ne 0 ]; then
    sleep 10
    adb pull /data/user/0/com.exmpl/files/ldk/ /mnt/artifacts/
fi

sleep 10
echo "Test finished"

exit $EXIT_CODE
