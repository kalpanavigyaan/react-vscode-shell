<#
.SYNOPSIS
    Start Vite dev server and Electron side by side (hot reload).
    Ctrl+C stops both.
#>
Set-Location (Split-Path -Parent $PSScriptRoot)
npm run electron:dev
