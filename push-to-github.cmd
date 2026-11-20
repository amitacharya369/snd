@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo =======================================================
echo  Signs ^& Decal Corp. - Push to GitHub
echo =======================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/amitacharya369/snd.git): "
if "!REPO_URL!"=="" (
    echo No repository URL provided. Aborting.
    pause
    exit /b 1
)

git remote remove origin 2>nul
git remote add origin !REPO_URL!
git branch -M main
echo.
echo Pushing to !REPO_URL!...
git push -u origin main
if %ERRORLEVEL% equ 0 (
    echo.
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo You can now import this repository on https://vercel.com/new
) else (
    echo.
    echo [ERROR] Push failed. If prompted for GitHub credentials, ensure you use a Personal Access Token (PAT) or Git Credential Manager.
)
pause
