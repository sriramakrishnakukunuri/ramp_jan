@echo off
setlocal enabledelayedexpansion

set /p war_name=Enter the WAR file name (without .war extension): 
set /p base_href=Enter the base href (e.g., /RAMP1/): 

if not "%base_href:~0,1%"=="/" set base_href=/%base_href%
if not "%base_href:~-1%"=="/" set base_href=%base_href%/

echo Building Angular application with base-href=%base_href%
call ng build --configuration=production --base-href=%base_href%
if %errorlevel% neq 0 (
    echo Error: Angular build failed
    exit /b 1
)

if not exist "dist\skill-development\" (
    echo Error: dist/skill-development folder not found after build
    echo Contents of dist folder:
    dir /b dist
    exit /b 1
)


echo Copying WEB-INF and META-INF folders to dist/skill-development
if exist "WEB-INF\" (
    xcopy /E /I /Y "WEB-INF" "dist\skill-development\WEB-INF\"
    if %errorlevel% neq 0 (
        echo Error: Failed to copy WEB-INF folder
        exit /b 1
    )
) else (
    echo Warning: WEB-INF folder not found in current directory
)

if exist "META-INF\" (
    xcopy /E /I /Y "META-INF" "dist\skill-development\META-INF\"
    if %errorlevel% neq 0 (
        echo Error: Failed to copy META-INF folder
        exit /b 1
    )
) else (
    echo Warning: META-INF folder not found in current directory
)


echo Creating WAR file %war_name%.war from dist/skill-development
pushd dist\skill-development


echo Current directory: %cd%
dir


jar -cvf %war_name%.war *
if %errorlevel% neq 0 (
    echo Error: WAR file creation failed
    popd
    exit /b 1
)


if not exist "%war_name%.war" (
    echo Error: WAR file was not created
    popd
    exit /b 1
)


echo Moving WAR file to package.json location
for /f "delims=" %%p in ('npm prefix') do set "npm_path=%%p"
move "%war_name%.war" "%npm_path%"
if %errorlevel% neq 0 (
    echo Error: Failed to move WAR file
    popd
    exit /b 1
)

popd


if exist "%npm_path%\%war_name%.war" (
    echo Success: Created %npm_path%\%war_name%.war
    echo WAR file includes:
    echo - Angular production build
    if exist "WEB-INF\" echo - WEB-INF folder
    if exist "META-INF\" echo - META-INF folder
) else (
    echo Error: WAR file not found at final destination
    exit /b 1
)

endlocal