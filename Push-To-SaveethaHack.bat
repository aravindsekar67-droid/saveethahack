@echo off
title Push DOOMSDAY AI to saveethahack
color 0A
echo ========================================================
echo   DOOMSDAY AI - Pushing to aravindsekar67-droid/saveethahack
echo ========================================================
echo.
cd /d "C:\Users\acer\OneDrive\Desktop\HACKATHON\shieldpay-ai"
git remote set-url origin https://github.com/aravindsekar67-droid/saveethahack.git
git push -u origin main
git push origin main:master
echo.
echo ========================================================
echo   SUCCESS! All files are pushed to:
echo   https://github.com/aravindsekar67-droid/saveethahack
echo ========================================================
pause
