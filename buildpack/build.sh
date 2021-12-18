#!/usr/bin/env bash
set -e

pwd=$(PWD)

yarn workspace @monstrs/buildpack-node-start build
cd "${pwd}/buildpack-node-start" && pack buildpack package monstrs/buildpack-node-start:0.0.3 --config ./package.toml

yarn workspace @monstrs/buildpack-yarn-install build
cd "${pwd}/buildpack-yarn-install" && pack buildpack package monstrs/buildpack-yarn-install:0.0.3 --config ./package.toml

yarn workspace @monstrs/buildpack-yarn-workspace-build build
cd "${pwd}/buildpack-yarn-workspace-build" && pack buildpack package monstrs/buildpack-yarn-workspace-build:0.0.3 --config ./package.toml

yarn workspace @monstrs/buildpack-yarn-workspace-node-options build
cd "${pwd}/buildpack-yarn-workspace-node-options" && pack buildpack package monstrs/buildpack-yarn-workspace-node-options:0.0.3 --config ./package.toml

yarn workspace @monstrs/buildpack-yarn-workspace-pack build
cd "${pwd}/buildpack-yarn-workspace-pack" && pack buildpack package monstrs/buildpack-yarn-workspace-pack:0.0.3 --config ./package.toml

yarn workspace @monstrs/buildpack-yarn-workspace-serve build
cd "${pwd}/buildpack-yarn-workspace-serve" && pack buildpack package monstrs/buildpack-yarn-workspace-serve:0.0.3 --config ./package.toml

yarn workspace @monstrs/buildpack-yarn-workspace-start build
cd "${pwd}/buildpack-yarn-workspace-start" && pack buildpack package monstrs/buildpack-yarn-workspace-start:0.0.3 --config ./package.toml

docker push monstrs/buildpack-yarn-install:0.0.3
docker push monstrs/buildpack-yarn-workspace-build:0.0.3
docker push monstrs/buildpack-yarn-workspace-node-options:0.0.3
docker push monstrs/buildpack-yarn-workspace-pack:0.0.3
docker push monstrs/buildpack-yarn-workspace-serve:0.0.3
docker push monstrs/buildpack-yarn-workspace-start:0.0.3

cd "${pwd}/buildpack-yarn-workspace" && pack buildpack package monstrs/buildpack-yarn-workspace:0.0.3 --config ./package.toml

docker push monstrs/buildpack-yarn-workspace:0.0.3
