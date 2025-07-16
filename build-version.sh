#!/bin/bash

# Ask for dynamic inputs
read -p "Enter the WAR file name (without .war extension): " war_name
read -p "Enter the base href (e.g., /RAMP1/): " base_href

# Ensure base href starts and ends with /
[[ "$base_href" != /* ]] && base_href="/$base_href"
[[ "$base_href" != */ ]] && base_href="$base_href/"

# Step 1: Angular production build with dynamic base-href
echo "Building Angular application with base-href=$base_href"
ng build --configuration=production --base-href="$base_href"
if [ $? -ne 0 ]; then
    echo "Error: Angular build failed"
    exit 1
fi

# Verify dist folder exists
if [ ! -d "dist/skill-development" ]; then
    echo "Error: dist/skill-development folder not found after build"
    echo "Contents of dist folder:"
    ls -l dist/
    exit 1
fi

# Step 2: Copy WEB-INF and META-INF folders to dist
echo "Copying WEB-INF and META-INF folders to dist/skill-development"
if [ -d "WEB-INF" ]; then
    cp -r WEB-INF dist/skill-development/
    if [ $? -ne 0 ]; then
        echo "Error: Failed to copy WEB-INF folder"
        exit 1
    fi
else
    echo "Warning: WEB-INF folder not found in current directory"
fi

if [ -d "META-INF" ]; then
    cp -r META-INF dist/skill-development/
    if [ $? -ne 0 ]; then
        echo "Error: Failed to copy META-INF folder"
        exit 1
    fi
else
    echo "Warning: META-INF folder not found in current directory"
fi

# Step 3: Create WAR file from dist/skill-development contents
echo "Creating WAR file ${war_name}.war from dist/skill-development"
pushd dist/skill-development > /dev/null

# Debug: Show current directory and contents
echo "Current directory: $(pwd)"
ls -l

# Create WAR file (including WEB-INF and META-INF if they exist)
jar -cvf "${war_name}.war" *
if [ $? -ne 0 ]; then
    echo "Error: WAR file creation failed"
    popd > /dev/null
    exit 1
fi

# Verify WAR file was created
if [ ! -f "${war_name}.war" ]; then
    echo "Error: WAR file was not created"
    popd > /dev/null
    exit 1
fi

# Step 4: Move WAR file to package.json location
echo "Moving WAR file to package.json location"
npm_path=$(npm prefix)
mv "${war_name}.war" "$npm_path/"
if [ $? -ne 0 ]; then
    echo "Error: Failed to move WAR file"
    popd > /dev/null
    exit 1
fi

popd > /dev/null

# Final verification
if [ -f "${npm_path}/${war_name}.war" ]; then
    echo "Success: Created ${npm_path}/${war_name}.war"
    echo "WAR file includes:"
    echo "- Angular production build"
    [ -d "WEB-INF" ] && echo "- WEB-INF folder"
    [ -d "META-INF" ] && echo "- META-INF folder"
else
    echo "Error: WAR file not found at final destination"
    exit 1
fi