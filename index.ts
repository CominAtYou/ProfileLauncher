import readline = require('readline');
import https = require('https');
import open = require('open');
import fs = require('fs');
import os = require('os');

const version = "1.2.1";

function userUpdatesEnabled() {
    if (fs.existsSync(`${os.homedir()}/.profilelauncherconfig`)) {
        const config: {checkForUpdatesOnLaunch: boolean | any} = JSON.parse(fs.readFileSync(`${os.homedir()}/.profilelauncherconfig`).toString());
        if (typeof config.checkForUpdatesOnLaunch === 'boolean') {
            return config.checkForUpdatesOnLaunch;
        }
        else {
            console.error(`Error in configuration file: ${config.checkForUpdatesOnLaunch}, a ${typeof config.checkForUpdatesOnLaunch}, is not a boolean (true/false).\nPlease edit the value in ${os.homedir()}/.profilelauncherconfig to resolve this issue.\n`);
            makeWindowPersist();
            process.exit();
        }
    } else {
        fs.writeFileSync(`${os.homedir()}/.profilelauncherconfig`, JSON.stringify({checkForUpdatesOnLaunch: true}, null, 2));
        return true;
    }
}

function makeWindowPersist() { // make the window persist for non-cli users
    let yeet = readline.createInterface({input: process.stdin, output: process.stdout});
    yeet.question("Press enter to exit.\n", () => {yeet.close()});
}

function checkForUpdates() {
    if (userUpdatesEnabled()) {
        const requestOptions = {
            hostname: 'arc.cominatyou.com',
            port: 443,
            path: '/sw-versioning/ProfileLauncher.json',
            method: 'GET'
        }
        const request = https.request(requestOptions, res => {
            res.on('data', d => {
                const data: {latestVersion: string, downloadURL: string} = JSON.parse(d);
                if (data.latestVersion !== version) {
                    console.log(`\x1b[1mA new version of ProfileLauncher is available!\x1b[0m\n\nInstalled version: \x1b[31m${version}\x1b[34m => \x1b[32m${data.latestVersion}\x1b[0m\n`);
                    console.log(`Download the new version at ${data.downloadURL}`);
                }
            });
        });
        request.on('error', () => {}); // fail silently
        request.end();
    }
}

function getProfile(username: string) {
    const requestOptions = {
        hostname: 'api.roblox.com',
        port: 443,
        path: `/users/get-by-username?username=${username}`,
        method: 'GET'
    }
    const request = https.request(requestOptions, res => {
        res.on('data', d => {
            const data: {Id: number, Username: string, AvatarUri: null, AvatarFinal: boolean, IsOnline: boolean, errorMessage: string, success: boolean} = JSON.parse(d);
            if (data.success === undefined && typeof data.Id === "number") { // roblox ids will only get bigger so i can't test in a range and as long as we get a number back it's fine
                open(`https://roblox.com/users/${data.Id}/profile`);
            }
            else if (data.success === false && data.errorMessage === "User not found") {
                console.error("That user doesn't exist!");
                makeWindowPersist();
            }
        });
    });
    request.on('error', error => {
        console.error("Something happened. Don't fret, just try again. If this continues to happen, please open an issue on GitHub and provide the following message:\n\n", error);
        makeWindowPersist();
    });
    request.end();
}

if (process.argv.includes('--help')) { // --help argument
    console.log(`\x1b[1mProfileLauncher Help\x1b[0m - Version ${version}`);
    console.log("A utility to open the Roblox profile of a user via the command line or desktop.\n");
    console.log("\x1b[1mUsage\x1b[0m: ProfileLauncher [arguments]\n");
    console.log("\x1b[1m\x1b[4mARGUMENTS\x1b[0m");
    console.log("-u, --username        Specify the username of the profile you wish to open.");
    console.log("--enableUpdateChecks  Takes true or false as a value. Set to true to enable")
    console.log("                       update checking, or set to false to disable it.")
    console.log("--version             Prints the version of the program.");
    console.log("--help                Displays this help message.\n");
    console.log("All arguments are optional.\n");
    console.log("Made by CominAtYou - https://github.com/CominAtYou");
} else if (process.argv.includes("--version")) {
    checkForUpdates();
    console.log("Version " + version);
} else if (process.argv.includes('--enableUpdateChecks')) {
    if (/(true|false)/i.test(process.argv[process.argv.indexOf('--enableUpdateChecks') + 1])) {
        const userChoice: boolean = JSON.parse(process.argv[process.argv.indexOf('--enableUpdateChecks') + 1]);
        if (fs.existsSync(`${os.homedir()}/.profilelauncherconfig`)) {
            fs.writeFileSync(`${os.homedir()}/.profilelauncherconfig`, JSON.stringify({checkForUpdatesOnLaunch: userChoice}, null, 2));
            console.log(`Update checking have been ${userChoice ? "enabled": "disabled"}.`);
        } else {
            console.log("The config file doesn't seem to be present on your system. Creating it for you now...")
            fs.writeFileSync(`${os.homedir()}/.profilelauncherconfig`, JSON.stringify({checkForUpdatesOnLaunch: userChoice}, null, 2));
            setTimeout(() => { console.log(`Created config file! Updates have been ${userChoice ? "enabled" : "disabled"}.`) }, 500); // add a small delay because it feels nice
        }
    } else {
        console.error(`Invalid parameter specified for --enableUpdateChecks`);
    }
} else if (process.argv.includes('--username') || process.argv.includes('-u')) { // specify username on the command line with --username or -u arg, checks if valid content-wise with .test()
    if (process.argv[process.argv.indexOf('--username') + 1] !== undefined || process.argv[process.argv.indexOf('-u') + 1] !== undefined) {
        const username = process.argv.includes('--username') ? process.argv[process.argv.indexOf('--username') + 1] : process.argv[process.argv.indexOf('-u') + 1]; // self explanatory
        if (/^(?=[^_]+_?[^_]+$)\w{3,20}$/i.test(username)) {
            checkForUpdates();
            getProfile(username);
        } else {
            console.error(`Invalid parameter specified for ${process.argv.includes('--username') ? '--username' : '-u'}`);
        }
    } else {
        console.error(`Parameter required for argument '${process.argv.includes('--username') ? '--username' : '-u'}'`);
    }
} else if (process.argv[2] === undefined || !process.argv[2].startsWith('-')) { // for those who don't use command line args
    checkForUpdates();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    setTimeout(() => {rl.question("Enter a username: ", username => { // let update checks finish first with little delay to actual program startup
        if (/^(?=[^_]+_?[^_]+$)\w{3,20}$/i.test(username) === true) {
            getProfile(username);
            rl.close();
        } else {
            console.log("Invalid username provided!\n");
            rl.close();
            makeWindowPersist();
        }
    })}, 200);
} else { // complains about invalid arguments
    let args = [...process.argv];
    args.slice(2); // remove the dumb file paths from the args array
    let validArgs = ['--username', '-u', '--help', '--version', '--enableUpdateChecks'];
    let invalidArgs = args.filter(v => v.startsWith('-') && !validArgs.includes(v)); // remove the legitimate args if there are any, so that we only complain about the invalid ones
    if (invalidArgs.length > 0) { // I think this always returns true but eh
        console.error(`Invalid argument${invalidArgs.length === 1 ? '' : 's'}: ${invalidArgs.join(", ")}`);
        makeWindowPersist();
    }
}