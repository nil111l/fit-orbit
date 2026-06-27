$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$target = Join-Path $root "release\windows\FitOrbit-win-unpacked-$stamp"
$electronDist = Join-Path $root "node_modules\electron\dist"

if (-not (Test-Path (Join-Path $electronDist "electron.exe"))) {
  throw "Electron runtime is missing. Run: `$env:ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'; npx install-electron"
}

New-Item -ItemType Directory -Path $target -Force | Out-Null
Copy-Item -Path (Join-Path $electronDist "*") -Destination $target -Recurse -Force

$appDir = Join-Path $target "resources\app"
New-Item -ItemType Directory -Path $appDir -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $root "dist") -Destination $appDir -Recurse -Force
Copy-Item -LiteralPath (Join-Path $root "electron") -Destination $appDir -Recurse -Force
Copy-Item -LiteralPath (Join-Path $root "package.json") -Destination $appDir -Force

Rename-Item -LiteralPath (Join-Path $target "electron.exe") -NewName "Fit Orbit.exe" -Force
Write-Host "Windows app created at: $target"
