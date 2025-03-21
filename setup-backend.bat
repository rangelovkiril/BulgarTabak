@echo off
echo Setting up ChronoFlow backend...
echo.

cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\backend

echo Installing backend dependencies...
call npm install lowdb@1.0.0 @types/lowdb uuid @types/uuid jsonwebtoken @types/jsonwebtoken

echo Creating data directory for lowdb...
mkdir data 2>nul

echo Initializing empty database...
echo {"users":[],"habits":[],"events":[]} > data\db.json

echo Backend setup complete!
echo.
echo To start the backend server, run:
echo cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\backend
echo npm run dev
echo.

pause
