@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo =======================================================
echo  Signs ^& Decal Corp. - Push to GitHub
echo =======================================================
echo.
echo Target Remote: https://github.com/amitacharya369/snd.git
echo.
git remote remove origin 2>nul
git remote add origin https://github.com/amitacharya369/snd.git
git branch -M main
echo Pushing to https://github.com/amitacharya369/snd.git...
echo (A GitHub authentication tab will open in Chrome if needed)
echo.
git push -u origin main
if %ERRORLEVEL% equ 0 (
    echo.
    echo =======================================================
    echo  [SUCCESS] Code successfully pushed to GitHub!
    echo =======================================================
    echo You can now deploy on https://vercel.com/new
) else (
    echo.
    echo [ERROR] Push failed. If authentication failed, you can also use a GitHub Personal Access Token (PAT).
)
echo.
pause
