@echo off
setlocal
cd /d "%~dp0"
set PORT=8765
set URL=http://127.0.0.1:%PORT%/

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Abrir.ps1"
if errorlevel 1 (
  echo Nao foi possivel abrir o site HARU.
  pause
)
endlocal
