export function showHelp(version: string) {
    console.log(`\x1b[1mProfileLauncher Help\x1b[0m - Version ${version}`);
    console.log("A utility to open the Roblox profile of a user via the command line or desktop.\n");
    console.log("\x1b[1mUsage\x1b[0m: ProfileLauncher [arguments]\n");
    console.log("\x1b[1m\x1b[4mARGUMENTS\x1b[0m");
    console.log("-u, --username        Specify the username of the profile you wish to open.");
    console.log("--enableUpdateChecks  Takes true or false as a value. Set to true to enable");
    console.log("                       update checking, or set to false to disable it.");
    console.log("--version             Prints the version of the program.");
    console.log("--help                Displays this help message.\n");
    console.log("All arguments are optional.\n");
    console.log("Made by CominAtYou - https://github.com/CominAtYou");
}