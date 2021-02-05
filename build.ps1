function checkSuccess([bool]$success) {
    if ($success -eq $false) {
        exit
    }
}
function compileTS {
    Write-Output "Compiling TypeScript..."
    tsc
    checkSuccess($?)
}

Get-Command npm 2>&1 > $NULL
Write-Host "Checking for dependencies..."
if ($? -eq $false) {
    Write-Error "Node.js is required to run this script. Please install it then re-run the script."
    exit
}

Get-Command tsc 2>&1 > $NULL
if ($? -eq $false) {
    Write-Output "tsc isn't detected, installing it for you now..."
    npm i typescript -g 2>&1 > $NULL
    if ($? -eq $false) {
        Write-Output "Failed to install tsc! You may need to run this script as root if you are on Linux or macOS."
        exit
    }
    Write-Output "Installed tsc!"
}

Get-Command pkg 2>&1 > $NULL
if ($? -eq $false) {
    Write-Output "pkg does not seem to be present, installing it for you now..."
    npm i pkg -g 2>&1 > $NULL
    if ($? -eq $false) {
        Write-Output "Failed to install pkg! You may need to run this script as root if you are on Linux or macOS."
        exit
    }
    Write-Output "Installed pkg!"
}

Write-Output "Available Targets:`n"
Write-Output "1: Windows 64-bit"
Write-Output "2: Windows 32-bit"
Write-Output "3: macOS (Intel)"
Write-Output "4: Linux 64-bit"
Write-Output "All: All targets`n"

$buildSelection = Read-Host "Selection"

$array = $buildSelection.ToLower().Split(", ")

if ($array.Contains('1')) {
    compileTS
    Write-Host "Building for Windows 64-bit..."
    pkg .\index.js --target node14-win-x64 --output build/profilelauncher-win-x64 > $NULL
    checkSuccess($?)
    Write-Output "Build complete!"
}
if ($array.Contains('2')) {
    compileTS
    Write-Host "Building for Windows 32-bit..."
    pkg .\index.js --target node14-win-x86 --output build/profilelauncher-win-x86 > $NULL
    checkSuccess($?)
    Write-Output "Build complete!"
}
if ($array.Contains('3')) {
    compileTS
    Write-Host "Building for macOS (Intel)..."
    pkg .\index.js --target node14-darwin-x64 --output build/profilelauncher-mac-x64 > $NULL
    checkSuccess($?)
    Write-Output "Build complete!"
}
if ($array.Contains('4')) {
    compileTS
    Write-Host "Building for Linux 64-bit..."
    pkg .\index.js --target node14-linux-x64 --output build/profilelauncher-linux-x64 > $NULL
    checkSuccess($?)
    Write-Output "Build complete!"
}
if ($array.Contains('all')) {
    compileTS
    Write-Host "Building for Windows 64-bit..."
    pkg .\index.js --target node14-win-x64 --output build/profilelauncher-win-x64 > $NULL
    checkSuccess($?)
    Write-Host "Building for Windows 32-bit..."
    pkg .\index.js --target node14-win-x86 --output build/profilelauncher-win-x86 > $NULL
    checkSuccess($?)
    Write-Host "Building for macOS (Intel)..."
    pkg .\index.js --target node14-darwin-x64 --output build/profilelauncher-mac-x64 > $NULL
    checkSuccess($?)
    Write-Host "Building for Linux 64-bit..."
    pkg .\index.js --target node14-linux-x64 --output build/profilelauncher-linux-x64 > $NULL
    checkSuccess($?)
    Write-Output "Build complete!"
}