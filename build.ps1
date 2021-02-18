Get-Command npm 2>&1 > $NULL
Write-Host "Checking for dependencies...`nQuerying: Node.js, tsc, pkg`n"
if ($? -eq $false) {
    Write-Error "Node.js is required to run this script. Please install it then re-run the script."
    exit
}

Get-Command tsc 2>&1 > $NULL
if ($? -eq $false) {
    Write-Output "tsc isn't detected, please intslal it then re-run the script."
    exit
}

Get-Command pkg 2>&1 > $NULL
if ($? -eq $false) {
    Write-Output "pkg does not seem to be present, please install it then re-run the script."
    exit
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
    tsc
    Write-Host "Building for Windows 64-bit..."
    pkg .\index.js --target node14-win-x64 --output build/profilelauncher-win-x64
    Write-Output "Build complete!"
}
if ($array.Contains('2')) {
    tsc
    Write-Host "Building for Windows 32-bit..."
    pkg .\index.js --target node14-win-x86 --output build/profilelauncher-win-x86
    Write-Output "Build complete!"
}
if ($array.Contains('3')) {
    tsc
    Write-Host "Building for macOS (Intel)..."
    pkg .\index.js --target node14-darwin-x64 --output build/profilelauncher-mac-x64
    Write-Output "Build complete!"
}
if ($array.Contains('4')) {
    tsc
    Write-Host "Building for Linux 64-bit..."
    pkg .\index.js --target node14-linux-x64 --output build/profilelauncher-linux-x64
    Write-Output "Build complete!"
}
if ($array.Contains('all')) {
    tsc
    Write-Host "Building for Windows 64-bit..."
    pkg .\index.js --target node14-win-x64 --output build/profilelauncher-win-x64
    Write-Host "Building for Windows 32-bit..."
    pkg .\index.js --target node14-win-x86 --output build/profilelauncher-win-x86
    Write-Host "Building for macOS (Intel)..."
    pkg .\index.js --target node14-darwin-x64 --output build/profilelauncher-mac-x64
    Write-Host "Building for Linux 64-bit..."
    pkg .\index.js --target node14-linux-x64 --output build/profilelauncher-linux-x64
    Write-Output "Build complete!"
}