Write-Output "Available Targets:`n"
Write-Output "1: Windows 64-bit"
Write-Output "2: Windows 32-bit"
Write-Output "3: macOS (Intel)"
Write-Output "4: Linux 64-bit"
Write-Output "All: All targets"

$buildSelection = Read-Host "Selection"

$array = $buildSelection.ToLower().Split(", ")

if ($array.Contains('1')) {
    Write-Host "Building for Windows 64-bit..."
    pkg .\index.js --target node14-win-x64 --output build/ProfileLauncher-win-x64 > $NULL
    Write-Output "Build complete!"
}
if ($array.Contains('2')) {
    Write-Host "Building for Windows 32-bit..."
    pkg .\index.js --target node14-win-x86 --output build/ProfileLauncher-win-x86 > $NULL
    Write-Output "Build complete!"
}
if ($array.Contains('3')) {
    Write-Host "Building for macOS (Intel)..."
    pkg .\index.js --target node14-darwin-x64 --output build/ProfileLauncher-mac-x64 > $NULL
    Write-Output "Build complete!"
}
if ($array.Contains('4')) {
    Write-Host "Building for Linux 64-bit..."
    pkg .\index.js --target node14-linux-x64 --output build/ProfileLauncher-linux-x64 > $NULL
    Write-Output "Build complete!"
}
if ($array.Contains('all')) {
    Write-Host "Building for Windows 64-bit..."
    pkg .\index.js --target node14-win-x64 --output build/ProfileLauncher-win-x64 > $NULL
    Write-Host "Building for Windows 32-bit..."
    pkg .\index.js --target node14-win-x86 --output build/ProfileLauncher-win-x86 > $NULL
    Write-Host "Building for macOS (Intel)..."
    pkg .\index.js --target node14-darwin-x64 --output build/ProfileLauncher-mac-x64 > $NULL
    Write-Host "Building for Linux 64-bit..."
    pkg .\index.js --target node14-linux-x64 --output build/ProfileLauncher-linux-x64 > $NULL
    Write-Output "Build complete!"
}