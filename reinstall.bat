@echo off
echo Reinstalling dependencies with correct versions...
echo.
echo Removing node_modules...
rmdir /s /q node_modules
echo.
echo Removing package-lock.json...
del package-lock.json
echo.
echo Installing dependencies...
npm install
echo.
echo Done!
pause
