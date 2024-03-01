#!/bin/sh

set -e

if [[ "$NODE_ENV" == "test" ]]; then
  yarn run test
else 
  yarn run start
fi
