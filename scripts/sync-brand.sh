#!/bin/sh
# Refetch the Flight Lab artwork from flightlab-brand into this template.
#
#     scripts/sync-brand.sh v1.0.0        pin to a tag (do this)
#     scripts/sync-brand.sh main          track the tip (don't, in a taught term)
#
# Copy this script into a template repository and set DEST to wherever that
# template keeps the artwork. It writes BRAND-VERSION beside it, so the copy
# always says where it came from.
set -eu
REF="${1:-main}"
REPO="https://github.com/BristolFlightLab/flightlab-brand.git"
DEST="${DEST:-assets}"
# Which files to take. Default: everything. A template that only needs the
# shared chrome sets this, so it doesn't ship another unit's mark.
FILES="${FILES:-edge-header.svg edge-section.svg edge-title.svg edge-title-inverted.svg logo-bristol.svg logo-bristol-white.svg}"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
git -c advice.detachedHead=false clone --quiet --depth 1 --branch "$REF" "$REPO" "$tmp/brand"

mkdir -p "$DEST"
for f in $(cd "$tmp/brand" && ls $FILES); do
  set -- "$tmp/brand/$f"
  f="$1"
  cp "$f" "$DEST/$(basename "$f")"
done
printf '%s\n%s\n' "$REF" "$(cd "$tmp/brand" && git rev-parse HEAD)" > BRAND-VERSION
echo "brand assets synced from $REF into $DEST"
