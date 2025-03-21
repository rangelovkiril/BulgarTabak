@echo off
echo Setting up Firebase integration...

cd c:\Users\IVO\Desktop\Hack Tuah\BulgarTabak\frontend
call npm install firebase@9.23.0 firebase-firestore firebase-functions firebase-auth

echo Setup complete!
echo.
echo Now you need to configure Firebase in your project.
echo.
echo 1. Set up Firestore database in Firebase console
echo 2. Enable Google Authentication in Firebase console
echo 3. Add localhost to authorized domains
pause
