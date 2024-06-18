#!/bin/bash

version="$(git tag)"
archive="pufferphish_${version}.tar.gz"

rm -f "${archive}"

tar czvf "${archive}" static templates -C release config.json
echo "SHA256: $(sha256sum "${archive}" | awk '{print $1}')"
