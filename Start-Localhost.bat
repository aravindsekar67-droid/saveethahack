@echo off
title DOOMSDAY AI - Localhost Launcher
echo ========================================================
echo   DOOMSDAY AI - Pre-Transaction Scam Defense Platform
echo ========================================================
echo.

cd /d "%~dp0"

:: Auto-detect and include portable Node.js if present
if exist "%LOCALAPPDATA%\nodejs\node-v20.18.0-win-x64\node.exe" (
    set "PATH=%LOCALAPPDATA%\nodejs\node-v20.18.0-win-x64;%PATH%"
)

echo [1/3] Verifying Backend Service on http://localhost:8080 ...
curl -s -o nul http://localhost:8080/api/admin/status
if %ERRORLEVEL% NEQ 0 (
    echo Starting Spring Boot AI Backend in new window...
    start "DOOMSDAY AI Backend" cmd /k "cd /d "%~dp0shieldpay-ai\backend" && mvnw.cmd spring-boot:run"
    echo Waiting 12 seconds for backend initialization...
    timeout /t 12 /nobreak >nul
) else (
    echo Backend is already running on port 8080.
)

echo.
echo [2/3] Verifying Frontend Service on http://localhost:5173 ...
curl -s -o nul http://localhost:5173
if %ERRORLEVEL% NEQ 0 (
    where npm >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [WARNING] 'npm' was not found! Please install Node.js to run the React Frontend.
    ) else (
        echo Starting React Vite Frontend in new window...
        start "DOOMSDAY AI Frontend" cmd /k "cd /d "%~dp0shieldpay-ai\frontend" && (if not exist node_modules call npm install) && npm run dev -- --host --port 5173"
    )
    timeout /t 4 /nobreak >nul
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
