@echo off
echo Installing lowdb and other required dependencies...
cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\backend
npm uninstall mysql2
npm install lowdb@1.0.0 @types/lowdb uuid @types/uuid
echo Installation complete!
pause
