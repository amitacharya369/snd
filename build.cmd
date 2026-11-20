@echo off
setlocal
cd /d "%~dp0"
echo [SND Build] Executing Next.js production build in %CD%...
npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [SND Build] Build failed with exit code %ERRORLEVEL%.
    exit /b %ERRORLEVEL%
)
echo [SND Build] Build completed successfully.
exit /b 0
