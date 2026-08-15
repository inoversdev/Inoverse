@echo off
title Inovers Tech Solutions
cd /d "%~dp0"

echo ========================================
echo   INOVERS V2 - SPACE ODYSSEY
echo   URL: http://localhost:5173/
echo ========================================
echo.

if not exist node_modules (
  echo Installing dependencies first time...
  call npm install
)

echo Starting Vite dev server...
echo Press Ctrl+C to stop.
echo.
call npm run dev

pause
