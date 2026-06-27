Write-Host "==> Installing dependencies..."
npm install

Write-Host "==> Type-checking..."
npm run typecheck

Write-Host "==> Building..."
npm run build

Write-Host "==> Done. Output in dist/"
