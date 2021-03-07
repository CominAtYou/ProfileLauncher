# ProfileLauncher
![build](https://github.com/CominAtYou/ProfileLauncher/workflows/build/badge.svg)

A utility to launch a Roblox profile from the command line or desktop.
## Usage
### From the Desktop
Double click the executable and enter a username.
### From the Command Line
```
profilelauncher [options]
```
#### Options:
`-u, --username`: Pass in a username as an argument, bypassing the need to type it in when ProfileLauncher is launched.

`--enableUpdateChecks`: Takes true or false as a value. Controls whether or not ProfileLauncher will check for updates on launch.

`--version`: Prints the version of the program.

`--help`: Displays a list of options.
## Putting ProfileLauncher on your PATH
Putting ProfileLauncher on your path is a good idea if you want to be able to run it from anywhere you can input a command, for example, on Windows, this enables ProfileLauncher to be launched just by typing `profilelauncher` into the Run dialog, and on Linux systems running GNOME, this allows you run it from the command dialog (Alt+F2). If you plan to only run it from a desktop shortcut or a specific folder, then this is not nessecary.
### Windows
1. Download the latest respective executable for your system from the [releases](https://github.com/CominAtYou/ProfileLauncher/releases) page.
2. **Rename the executable to `profilelauncher`**.
3. Type `%localappdata%\Programs` into the File Explorer address bar and hit enter. In here, create a folder called `ProfileLauncher`.
4. Move the executable you downloaded into the folder you just created.
5. Open Control Panel, and search for `Environment Variables`.
6. Select `Edit environment variables for your account`.
7. Under `User variables`, select Path and click `Edit`.
8. Click `New` and type in the path of the folder you created.
### macOS
1. Download the latest macOS executable from the [releases](https://github.com/CominAtYou/ProfileLauncher/releases) page.
2. **Rename the executable to `profilelauncher`**.
3. Copy the executable.
4. Press ⌘+Shift+G while in Finder, and type `/usr/local/bin`.
5. Paste the executable you copied in here, and enter your password if prompted.
### Linux
1. Download the latest respective Linux executable for your machine from the [releases](https://github.com/CominAtYou/ProfileLauncher/releases) page.
2. **Rename the executable to `profilelauncher`**.
3. Move the executable to `~/.local/bin` or `/usr/local/bin` if you want to make it available for every user. Some distrobutions (like Arch) forgo adding `~/.local/bin` to PATH by default, so if you opt for the former, you may need to manually add `/home/your_username/.local/bin` to your PATH variable.
## Enabling / Disabling update checks
By default, ProfileLauncher will check for updates every time it starts up. If you don't want it to check for updates, you can disable the checks by running `profilelauncher --enableUpdateChecks false` from the command line if ProfileLauncher is on your [PATH](#putting-profilelauncher-on-your-path), or by changing the value in `.profilelauncherconfig`, located in your home directory.
| Operating System | Path |
| ---------------- | ---- |
| Windows          | C:\Users\you\\.profilelauncherconfig |
| macOS, Linux     | ~/.profilelauncherconfig |

To re-enable update checks, run `profielauncher --enableUpdateChecks true` if ProfileLauncher is on your [PATH](#putting-profilelauncher-on-your-path), or change the value in `.profilelauncherconfig` to `true`.
## Building ProfileLauncher
You will need Node.js installed to build. You will also need PowerShell Core if you are not on Windows and are not building manually.
### Automated build
1. Install tsc and pkg:

    ```
    npm i -g typescript pkg
    ```
2. Run build.ps1.
### Manual Build
1. Clone the repository.
2. Install tsc and pkg:

    ```
    npm i -g typescript pkg
    ```
3. Compile the TypeScript source into JavaScript:

    ```
    tsc
    ```
4. Compile the JavaScript into an executable:

    ```
    pkg index.js --target=YOUR_TARGET_HERE --output=DESIRED_FILE_NAME
    ```
    Replace `YOUR_TARGET_HERE` with one of the following in the 'target' column:
    | Operating System | Target |
    | ---------------- | ------ |
    | Windows 64-bit   | node14-win-x64 |
    | Windows 32-bit   | node14-win-x86 |
    | macOS            | node14-darwin-x64 |
    | Linux 64-bit     | node14-linux-x64 |
