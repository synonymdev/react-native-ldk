#!/bin/bash

set -eo pipefail

#Start metro server
yarn start &
P1=$!
#perform tests
yarn e2e:ios-test &
P2=$!
#wait for tests to finish
wait $P2
#kill metro server
kill $P1
