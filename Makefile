windows-x64:
	tsc
	pkg .\index.js --target node14-win-x64 --output build/profilelauncher-win-x64
windows-x86:
	tsc
	pkg .\index.js --target node14-win-x86 --output build/profilelauncher-win-x86
darwin:
	tsc
	pkg .\index.js --target node14-darwin-x64 --output build/profilelauncher-mac-x64
linux-x64:
	tsc
	pkg .\index.js --target node14-linux-x64 --output build/profilelauncher-linux-x64
all:
	tsc
	pkg .\index.js --target node14-win-x64 --output build/profilelauncher-win-x64
	pkg .\index.js --target node14-win-x86 --output build/profilelauncher-win-x86
	pkg .\index.js --target node14-darwin-x64 --output build/profilelauncher-mac-x64
	pkg .\index.js --target node14-linux-x64 --output build/profilelauncher-linux-x64
