<#
.SYNOPSIS
    Build the React app for browser deployment → dist/
#>
Set-Location (Split-Path -Parent $PSScriptRoot)
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$js  = Get-ChildItem dist\assets -Filter *.js  | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$css = Get-ChildItem dist\assets -Filter *.css | Sort-Object LastWriteTime -Descending | Select-Object -First 1
Write-Host ""
Write-Host "Browser build complete." -ForegroundColor Green
Write-Host "  JS  : $([math]::Round($js.Length/1KB)) KB  ($($js.Name))"  -ForegroundColor DarkGray
Write-Host "  CSS : $([math]::Round($css.Length/1KB)) KB  ($($css.Name))" -ForegroundColor DarkGray
Write-Host "  Serve: npx serve dist   or   npm run preview" -ForegroundColor DarkGray
