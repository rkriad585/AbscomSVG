#!/usr/bin/env sh
set -euo pipefail

PREFIX="${1:-/usr/local}"
VERSION="0.2.963"
TARBALL="abscomsvg-$VERSION.tgz"

echo "==> Downloading AbscomSVG v$VERSION..."
npm pack abscomsvg@"$VERSION" --pack-destination /tmp 2>/dev/null || {
  echo "==> Building from source..."
  npm install
  npm run build
  mkdir -p "$PREFIX/lib/node_modules/abscomsvg"
  cp -r dist package.json "$PREFIX/lib/node_modules/abscomsvg/"
  echo "==> Installed to $PREFIX/lib/node_modules/abscomsvg"
  exit 0
}

mkdir -p "$PREFIX/lib/node_modules/abscomsvg"
tar -xzf "/tmp/$TARBALL" -C "$PREFIX/lib/node_modules/abscomsvg" --strip-components=1
echo "==> Installed to $PREFIX/lib/node_modules/abscomsvg"
