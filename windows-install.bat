@echo off
setlocal

echo Installing npm packages...
npm install && echo npm packages installed successfully.

echo Installing Playwright dependencies...
npx playwright install && echo Playwright dependencies installed successfully.

echo ----------------------------
echo You can now run generator with start.bat
pause
endlocal