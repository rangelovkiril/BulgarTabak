@echo off
echo Setting up ChronoFlow full stack application...
echo.

echo Step 1: Setting up backend...
cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\backend

echo Installing backend dependencies...
call npm install lowdb@1.0.0 @types/lowdb uuid @types/uuid jsonwebtoken @types/jsonwebtoken cors express dotenv socket.io google-auth-library

echo Setting up development dependencies...
call npm install --save-dev @types/cors @types/express @types/jsonwebtoken @types/node @types/socket.io @types/uuid nodemon ts-node typescript

echo Creating data directory for lowdb...
mkdir data 2>nul

echo Initializing empty database...
echo {"users":[],"habits":[],"events":[]} > data\db.json

echo Step 2: Setting up frontend...
cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\frontend
call npm install

echo Setup complete!
echo.
echo To start the application:
echo 1. Start the backend: cd backend && npm run dev
echo 2. Start the frontend: cd frontend && npm run dev
echo 3. Use the "Local Demo Mode" button for development
echo.

pause
