param(
  [string]$Prefix = "$env:APPDATA\npm\node_modules"
)

$Version = "0.2.963"
$Target = Join-Path $Prefix "abscomsvg"

Write-Host "==> Downloading AbscomSVG v$Version..."
try {
  npm pack "abscomsvg@$Version" --pack-destination "$env:TEMP" 2>&1 | Out-Null
  $Tarball = Get-ChildItem "$env:TEMP\abscomsvg-*.tgz" | Select-Object -First 1
  if (-not (Test-Path $Target)) { New-Item -ItemType Directory -Path $Target -Force | Out-Null }
  tar -xzf $Tarball.FullName -C $Target --strip-components=1
  Write-Host "==> Installed to $Target"
} catch {
  Write-Host "==> Building from source..."
  npm install
  npm run build
  if (-not (Test-Path $Target)) { New-Item -ItemType Directory -Path $Target -Force | Out-Null }
  Copy-Item -Recurse dist, package.json $Target
  Write-Host "==> Installed to $Target"
}
