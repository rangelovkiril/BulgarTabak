@echo off
echo Starting the ChronoFlow application in Local Demo Mode
echo.
echo This script will ensure the application works without a backend server
echo.

echo 1. Setting up environment...
cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\frontend
echo.

echo 2. Starting frontend (Vite development server)...
echo.
echo When the browser opens, click the "Local Demo Mode" button to bypass backend requirements
echo.
echo IMPORTANT: Use the LOCAL DEMO MODE button, not Google login!
echo.
echo Press Ctrl+C to stop the server when finished
echo.
npm run dev

pause
