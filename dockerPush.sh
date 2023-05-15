#!/bin/bash

if [ $# -le 0 ]
then
  echo "Missing version argument";
  exit 1;
else
  version=$1;
fi

echo "Pushing image ghcr.io/maxmukhanov/team-splitter-ui:${version}"
docker push ghcr.io/maxmukhanov/team-splitter-ui:$version