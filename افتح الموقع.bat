@echo off
cd /d "%~dp0"

start "" cmd /k "npm run dev"

:wait
timeout /t 2 >nul

powershell -command "try { Invoke-WebRequest http://localhost:5173 -UseBasicParsing > $null; exit 0 } catch { exit 1 }"

if errorlevel 1 goto wait

start http://localhost:5173