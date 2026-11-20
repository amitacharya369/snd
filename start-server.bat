@echo off
title Signs & Decal Corp. Website Server
echo Starting Signs & Decal Corp. Production Server on port 3001...
set PATH=C:\Users\Production\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.22_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v22.22.0-win-x64;C:\Users\Production\AppData\Local\Programs\Git\cmd;%PATH%
cd /d "C:\Users\Production\Documents\SND"
npx next start -p 3001
pause
