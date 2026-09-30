@echo off
title DOOMSDAY AI - Localhost Launcher
echo ========================================================
echo   DOOMSDAY AI - Pre-Transaction Scam Defense Platform
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Verifying Backend Service on http://localhost:8080 ...
curl -s -o nul http://localhost:8080/api/admin/status
if %ERRORLEVEL% NEQ 0 (
    echo Starting Spring Boot AI Backend in new window...
    start "DOOMSDAY AI Backend" cmd /c "cd shieldpay-ai\backend && C:\Users\acer\maven\bin\mvn.cmd spring-boot:run"
    echo Waiting 8 seconds for backend initialization...
    timeout /t 8 /nobreak >nul
) else (
    echo Backend is already running on port 8080.
)

echo.
echo [2/3] Verifying Frontend Service on http://localhost:5173 ...
curl -s -o nul http://localhost:5173
if %ERRORLEVEL% NEQ 0 (
    echo Starting React Vite Frontend in new window...
    start "DOOMSDAY AI Frontend" cmd /c "cd shieldpay-ai\frontend && npm run dev -- --host --port 5173"
    timeout /t 3 /nobreak >nul
) else (
    echo Frontend is already running on port 5173.
)

echo.
echo [3/3] Opening DOOMSDAY AI in default browser...
start http://localhost:5173

echo.
echo ========================================================
echo   DOOMSDAY AI is LIVE!
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8080
echo ========================================================
echo.
pause
