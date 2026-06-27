#!/usr/bin/env sh
set -euo pipefail

echo "==> Installing dependencies..."
npm install

echo "==> Type-checking..."
npm run typecheck

echo "==> Building..."
npm run build

echo "==> Done. Output in dist/"
