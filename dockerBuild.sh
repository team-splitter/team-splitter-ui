#!/bin/bash

if [ $# -le 0 ]
then
  echo "Missing version argument";
  exit 1;
else
  version=$1;
fi

echo "Building version "$version

echo "Building image mukhanovmax/team-splitter-ui:${version}"
docker build -t mukhanovmax/team-splitter-ui:$version .
