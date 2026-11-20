<#
.SYNOPSIS
    Builds the Signs & Decal Corp. (SND) Next.js production bundle.
.DESCRIPTION
    Ensures execution in the project directory with verified Node.js environment.
#>
[CmdletBinding()]
param()

$ProjectRoot = $PSScriptRoot
if (-not $ProjectRoot) {
    $ProjectRoot = "C:\Users\Production\Documents\SND"
}

Push-Location $ProjectRoot
try {
    Write-Host "[SND Build] Starting production build in $ProjectRoot..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "[SND Build] Build failed with exit code $LASTEXITCODE."
        exit $LASTEXITCODE
    }
    Write-Host "[SND Build] Build completed successfully." -ForegroundColor Green
}
finally {
    Pop-Location
}
