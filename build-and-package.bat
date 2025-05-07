@echo off
setlocal

:: Configuration
set APP_NAME=RAMP1
set ANGULAR_BUILD_DIR=dist\skill-development\%APP_NAME%
set WAR_OUTPUT_DIR=dist\skill-development
set WAR_NAME=%APP_NAME%.war
set WAR_FULL_PATH=%WAR_OUTPUT_DIR%\%WAR_NAME%

echo ========================================
echo 🛠️ Step 1: Building Angular project for production...
echo ========================================
ng build --configuration=production --base-href=/%APP_NAME%/
if errorlevel 1 (
    echo ❌ Angular build failed.
    exit /b 1
)

:: Step 2: Ensure WAR output folder exists
if not exist "%WAR_OUTPUT_DIR%" (
    mkdir "%WAR_OUTPUT_DIR%"
)

:: Step 3: Create WAR file in the target folder
echo ========================================
echo 📦 Step 2: Creating WAR file at: %WAR_FULL_PATH%
echo ========================================
cd %ANGULAR_BUILD_DIR%
jar -cvf "..\skill-development\%WAR_NAME%" *
if errorlevel 1 (
    echo ❌ WAR file creation failed.
    exit /b 1
)
cd ..\..

echo ✅ WAR file successfully created at: %WAR_FULL_PATH%

:: Step 4: Open the WAR output folder in Explorer
echo 📂 Opening folder: %WAR_OUTPUT_DIR%
start "" "%WAR_OUTPUT_DIR%"

endlocal
pause
