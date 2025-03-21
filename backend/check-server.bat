@echo off
echo Checking if server is running...
timeout /t 1 /nobreak > nul

REM Try to connect to the backend server
curl -s -o nul -w "%%{http_code}" http://localhost:3001

if %errorlevel% neq 0 (
  echo ❌ Backend server is not running!
  echo.
  echo Please start the backend server using the following commands:
  echo.
  echo cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\backend
  echo npm run dev
  echo.
) else (
  echo ✅ Backend server is running!
)

pause
