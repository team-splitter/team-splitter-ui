#!/bin/bash

if [ $# -le 0 ]
then
  echo "Missing version argument";
  exit 1;
else
  version=$1;
fi

echo "Pushing image mukhanovmax/team-splitter-ui:${version}"
docker push mukhanovmax/team-splitter-ui:$version