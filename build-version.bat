@echo off
echo ========================================
echo WAR File Builder for Windows
echo ========================================
echo.

REM Ask for inputs
set /p war_name="Enter WAR file name (without .war extension): "
if "%war_name%"=="" set war_name=app

set /p base_href="Enter base href (e.g., /RAMP1/): "
if "%base_href%"=="" set base_href=/

REM Format base_href
if not "%base_href:~0,1%"=="/" set base_href=/%base_href%
if not "%base_href:~-1%"=="/" set base_href=%base_href%/

echo.
echo Building: %war_name%.war with base-href=%base_href%
echo.

REM Angular build
echo Running Angular build...
call ng build --configuration=production --base-href="%base_href%"
if %errorlevel% neq 0 (
    echo [ERROR] Angular build failed
    pause
    exit /b 1
)
echo [OK] Angular build complete
echo.

REM Check dist folder
if exist "dist\skill-development" (
    set DIST_FOLDER=dist\skill-development
) else (
    echo [ERROR] dist\skill-development folder not found
    echo Available folders in dist:
    dir dist /b
    pause
    exit /b 1
)

REM Copy WEB-INF if exists
if exist "WEB-INF" (
    echo Copying WEB-INF...
    xcopy /E /I /Y WEB-INF "%DIST_FOLDER%\WEB-INF\" >nul
    echo [OK] WEB-INF copied
) else (
    echo [WARNING] WEB-INF folder not found - skipping
)

REM Copy META-INF if exists
if exist "META-INF" (
    echo Copying META-INF...
    xcopy /E /I /Y META-INF "%DIST_FOLDER%\META-INF\" >nul
    echo [OK] META-INF copied
) else (
    echo [WARNING] META-INF folder not found - skipping
)

echo.
echo Creating WAR file...
echo.

REM Create WAR file
cd "%DIST_FOLDER%"

REM Check if jar command is available
where jar >nul 2>nul
if %errorlevel% equ 0 (
    jar -cvf "%war_name%.war" *
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create WAR file
        cd ..\..\..
        pause
        exit /b 1
    )
) else (
    echo [WARNING] jar command not found, using PowerShell...
    powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('.', '%war_name%.war')"
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create WAR file
        cd ..\..\..
        pause
        exit /b 1
    )
)

if not exist "%war_name%.war" (
    echo [ERROR] WAR file not created
    cd ..\..\..
    pause
    exit /b 1
)

echo [OK] WAR file created: %war_name%.war
echo.

REM Move WAR file to project root
echo Moving WAR file to project root...
move /Y "%war_name%.war" ..\..\ >nul
if %errorlevel% neq 0 (
    echo [ERROR] Failed to move WAR file
    cd ..\..\..
    pause
    exit /b 1
)

cd ..\..\..

echo.
echo ========================================
echo [SUCCESS] WAR file created successfully!
echo Location: %cd%\%war_name%.war
echo ========================================
echo.

REM Show file size
for %%A in ("%war_name%.war") do echo Size: %%~zA bytes
echo.

pause