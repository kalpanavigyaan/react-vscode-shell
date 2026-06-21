<#
.SYNOPSIS
    Build the React app then package as an Electron desktop app → dist-electron/

.PARAMETER Platform
    Target platform: win (default), mac, linux
#>
param([string]$Platform = "win")

Set-Location (Split-Path -Parent $PSScriptRoot)

# 1. Build React with relative base so Electron can load it via file://
Write-Host "Building React app..." -ForegroundColor Cyan
npx vite build --base ./
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# 2. Package with electron-builder
Write-Host "Packaging Electron app ($Platform)..." -ForegroundColor Cyan
switch ($Platform) {
    "mac"   { npx electron-builder --mac }
    "linux" { npx electron-builder --linux }
    default { npx electron-builder --win }
}
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Electron build complete → dist-electron/" -ForegroundColor Green
