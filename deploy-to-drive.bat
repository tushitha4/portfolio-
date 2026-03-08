@echo off
echo ========================================
echo    Portfolio Deployment to Google Drive
echo ========================================
echo.
echo This script will help you prepare your portfolio for Google Drive upload
echo.

REM Create portfolio directory structure
echo [1] Creating portfolio archive...
cd /d "%~dp0"

REM Create a clean portfolio folder
if not exist "portfolio-upload" mkdir "portfolio-upload"
cd "portfolio-upload"

REM Copy all necessary files
echo [2] Copying portfolio files...
copy "..\portfolio-showcase-secure.html" "index.html"
xcopy "..\landing-page" "landing-page" /E /I /Y
xcopy "..\form-suite" "form-suite" /E /I /Y
xcopy "..\search-filters" "search-filters" /E /I /Y
xcopy "..\chatbot" "chatbot" /E /I /Y
xcopy "..\ecommerce" "ecommerce" /E /I /Y
xcopy "..\user-dashboard" "user-dashboard" /E /I /Y
xcopy "..\cms" "cms" /E /I /Y
xcopy "..\live-dashboard" "live-dashboard" /E /I /Y
copy "..\README.md" "README.md"

REM Create ZIP file
echo [3] Creating ZIP archive...
powershell -command "Compress-Archive -Path * -DestinationPath '../portfolio-ready.zip' -Force"

cd ..
rmdir /s /q "portfolio-upload"

echo.
echo ========================================
echo    DEPLOYMENT READY!
echo ========================================
echo.
echo Your portfolio is ready for Google Drive upload!
echo.
echo File created: portfolio-ready.zip
echo.
echo Next steps:
echo 1. Go to drive.google.com
echo 2. Upload portfolio-ready.zip
echo 3. Extract files in Google Drive
echo 4. Share index.html publicly
echo 5. Get your portfolio URL
echo.
echo Press any key to open Google Drive...
pause > nul
start https://drive.google.com

echo.
echo Deployment helper complete!
echo.
pause
