<#
.SYNOPSIS
    Start the browser dev server at http://localhost:5174 (hot reload).
#>
Set-Location (Split-Path -Parent $PSScriptRoot)
npm run dev
