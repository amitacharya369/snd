@echo off
setlocal EnableDelayedExpansion

echo =======================================================
echo       Signs ^& Decal Corp. - Push to GitHub
echo =======================================================
echo.

set "REPO_URL=https://github.com/amitacharya369/snd.git"

echo Target Repository: !REPO_URL!
echo.

git remote get-url origin >nul 2>&1

if errorlevel 1 (
    git remote add origin !REPO_URL!
) else (
    git remote set-url origin !REPO_URL!
)

git branch -M main

echo.
echo Pushing code to GitHub...
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo [ERROR] Push failed. Check GitHub authentication and errors.
) else (
    echo.
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo.
    echo Vercel should now process the production deployment.
)

echo.
pause
endlocal
