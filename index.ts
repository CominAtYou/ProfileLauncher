import readline = require('readline');
import https = require('https');
import open = require('open');

const version = "1.1b";

function makeWindowPersist() { // make the window persist for non-shell users
    let yeet = readline.createInterface({input: process.stdin, output: process.stdout});
    yeet.question("Press enter to exit. ", () => {yeet.close()});
}

function checkForUpdates() {
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
    console.log("--version             Prints the version of the program.");
    console.log("--help                Displays this help message.\n");
    console.log("All arguments are optional.\n");
    console.log("Made by CominAtYou - https://github.com/CominAtYou");
} else if (process.argv.includes("--version")) {
    checkForUpdates();
    console.log("Version " + version);
} else if (process.argv.includes('--username') && /^(?=[^_]+_?[^_]+$)\w{3,20}$/i.test(process.argv[process.argv.indexOf('--username') + 1]) || process.argv.includes('-u') && /^(?=[^_]+_?[^_]+$)\w{3,20}$/i.test(process.argv[process.argv.indexOf('-u') + 1])) { // specify username on the command line with --username or -u arg, checks if valid content-wise with .test()
    const username = process.argv.includes('--username') ? process.argv[process.argv.indexOf('--username') + 1] : process.argv[process.argv.indexOf('-u') + 1]; // self explanatory
    checkForUpdates();
    getProfile(username);
} else if (process.argv[2] === undefined || !process.argv[2].startsWith('-')) { // for those who don't use command line args
    checkForUpdates();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    setTimeout(() => {rl.question("Enter a username: ", username => {
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
    let args = process.argv;
    args.shift(); // remove the dumb file paths from the args array
    args.shift();
    if (args.includes('--username') || args.includes('-u')) { // if a username arg was passed, but the contents of it are invalid
        if (/^(?=[^_]+_?[^_]+$)\w{3,20}$/i.test(args[args.indexOf('--username') + 1]) === false || /^(?=[^_]+_?[^_]+$)\w{3,20}$/i.test(args[args.indexOf('-u') + 1]) === false) {
            console.error(`Invalid parameter specified for ${args.includes('--username') ? '--username' : '-u'}`);
        } else if (args[args.indexOf('--username') + 1] === undefined || args[args.indexOf('-u') + 1] === undefined) {
            console.error(`Parameter required for argument '${args.includes('--username') ? '--username' : '-u'}'`);
        }
    } else { // invalid arg(s) passed
        let validArgs = ['--username', '-u', '--help', '--version'];
        let invalidArgs = args.filter(v => v.startsWith('-') && !validArgs.includes(v)); // remove the legitimate args if there are any, so that we only complain about the invalid ones
        if (invalidArgs.length > 0) { // I think this always returns true but eh
            console.error(`Invalid argument${invalidArgs.length === 1 ? '' : 's'}: ${invalidArgs.join(", ")}`);
            makeWindowPersist();
        }
    }
}