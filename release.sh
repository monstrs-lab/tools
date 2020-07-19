#!/usr/bin/env bash

set -ex

if ! [[ -z $(git status --porcelain) ]]; then
  echo 'This command must be executed on a clean repository'
  exit 1
fi

RELEASE_DETAILS=$(yarn version apply --all --json)
RELEASE_SIZE=$(wc -l <<< "$RELEASE_DETAILS")

if [[ $RELEASE_SIZE -eq 0 ]]; then
  echo "No package to release"
  exit 1
elif [[ $RELEASE_SIZE -eq 1 ]]; then
  COMMIT_MESSAGE="Releasing one new package"
else
  COMMIT_MESSAGE="Releasing ${RELEASE_SIZE} new packages"
fi

NL=$'\n'

COMMIT_MESSAGE="$COMMIT_MESSAGE$NL$NL| Package name | Version |$NL"
COMMIT_MESSAGE="$COMMIT_MESSAGE| --- | --- |$NL"

UPDATE_ARGUMENTS=()

while read line; do
  echo $line

  IDENT=$(jq -r .ident <<< "$line")
  VERSION=$(jq -r .newVersion <<< "$line")

  COMMIT_MESSAGE="$COMMIT_MESSAGE| \`$IDENT\` | \`$VERSION\` |$NL"
  UPDATE_ARGUMENTS+=(--include "$IDENT")

  yarn workspace "$IDENT" pack --dry-run >& /dev/null || (
    echo "Couldn't run prepack on $IDENT"
    exit 1
  )
done <<< "$RELEASE_DETAILS"

echo

git add .
git commit -m "$COMMIT_MESSAGE" --no-verify

yarn workspaces foreach \
  --verbose --topological --no-private "${UPDATE_ARGUMENTS[@]}" \
  npm publish --tolerate-republish --access public
