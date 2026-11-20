@echo off
setlocal
cd /d "%~dp0"
echo [SND Production] Starting Next.js production server on http://localhost:3000...
npm run start
