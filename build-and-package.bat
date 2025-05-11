@echo off
setlocal enabledelayedexpansion

:: Ask for dynamic inputs
set /p war_name=Enter the WAR file name (without .war extension): 
set /p base_href=Enter the base href (e.g., /RAMP1/): 

:: Ensure base href starts and ends with /
if not "%base_href:~0,1%"=="/" set base_href=/%base_href%
if not "%base_href:~-1%"=="/" set base_href=%base_href%/

:: Step 1: Angular production build with dynamic base-href
echo Building Angular application with base-href=%base_href%
call ng build --configuration=production --base-href=%base_href%
if %errorlevel% neq 0 (
    echo Error: Angular build failed
    exit /b 1
)

:: Verify dist folder exists
if not exist "dist\skill-development\" (
    echo Error: dist/skill-development folder not found after build
    echo Contents of dist folder:
    dir /b dist
    exit /b 1
)

:: Step 2: Create WAR file from dist/skill-development contents
echo Creating WAR file %war_name%.war from dist/skill-development
pushd dist\skill-development

:: Debug: Show current directory and contents
echo Current directory: %cd%
dir

:: Create WAR file
jar -cvf %war_name%.war *
if %errorlevel% neq 0 (
    echo Error: WAR file creation failed
    popd
    exit /b 1
)

:: Verify WAR file was created
if not exist "%war_name%.war" (
    echo Error: WAR file was not created
    popd
    exit /b 1
)

:: Step 3: Move WAR file to package.json location
echo Moving WAR file to package.json location
for /f "delims=" %%p in ('npm prefix') do set "npm_path=%%p"
move "%war_name%.war" "%npm_path%"
if %errorlevel% neq 0 (
    echo Error: Failed to move WAR file
    popd
    exit /b 1
)

popd

:: Final verification
if exist "%npm_path%\%war_name%.war" (
    echo Success: Created %npm_path%\%war_name%.war
) else (
    echo Error: WAR file not found at final destination
    exit /b 1
)

endlocal