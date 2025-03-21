@echo off
echo Running database setup script...

REM Try to find MySQL in common installation locations
SET FOUND_MYSQL=0
SET MYSQL_PATH=

REM Check common MySQL installation paths
IF EXIST "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
  SET MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
  SET FOUND_MYSQL=1
)
IF %FOUND_MYSQL%==0 IF EXIST "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe" (
  SET MYSQL_PATH="C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
  SET FOUND_MYSQL=1
)
IF %FOUND_MYSQL%==0 IF EXIST "C:\xampp\mysql\bin\mysql.exe" (
  SET MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"
  SET FOUND_MYSQL=1
)
IF %FOUND_MYSQL%==0 IF EXIST "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe" (
  SET MYSQL_PATH="C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe"
  SET FOUND_MYSQL=1
)

IF %FOUND_MYSQL%==1 (
  echo MySQL found at: %MYSQL_PATH%
  echo You will be prompted for your MySQL root password.
  %MYSQL_PATH% -u root -p < src\db\init.sql
  
  IF %ERRORLEVEL% EQU 0 (
    echo Database setup completed successfully!
  ) ELSE (
    echo Error executing MySQL script. Check your credentials.
  )
) ELSE (
  echo Could not find MySQL executable automatically.
  echo.
  echo Please try one of these solutions:
  echo.
  echo 1. Edit this batch file and set the correct path to your MySQL executable:
  echo    Open setup-db.bat in Notepad and update the MYSQL_PATH variable
  echo.
  echo 2. Run the SQL script manually:
  echo    a. Open a command prompt
  echo    b. Navigate to your MySQL bin directory
  echo    c. Run: mysql -u root -p
  echo    d. Enter your password when prompted
  echo    e. Copy and paste the contents of src\db\init.sql
  echo.
  echo 3. Use MySQL Workbench or phpMyAdmin to run the script
)

pause
