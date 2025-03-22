@echo off
echo Starting ChronoFlow Application...

echo Opening backend terminal...
start cmd /k "cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\backend && npm run dev"

echo Opening frontend terminal...
start cmd /k "cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\frontend && npm run dev"

echo Application starting!
echo - Backend: http://localhost:3001
echo - Frontend: http://localhost:5173
echo.
echo Use the "Local Demo Mode" button if you encounter authentication issues.
