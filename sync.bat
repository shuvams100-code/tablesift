@echo off
echo.
echo ========================================
echo    TableSift - Git Sync
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Staging all changes...
git add .

echo.
echo [2/3] Creating commit...
set /p msg="Enter commit message (or press Enter for default): "
if "%msg%"=="" set msg=Update TableSift

git commit -m "%msg%"

echo.
echo [3/3] Pushing to GitHub...
git push

echo.
echo ========================================
echo    Done! Changes pushed to GitHub.
echo    Vercel will auto-deploy shortly.
echo ========================================
echo.
pause
