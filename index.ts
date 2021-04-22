import readline = require('readline');
import open = require('open');
import fs = require('fs');
import os = require('os');
import { makeWindowPersist } from './lib/windowPersist';
import { checkForUpdates } from './lib/updates';
import { getProfile } from './lib/getProfile';
import { showHelp } from './lib/help';

const version = "1.2.4";

if (process.argv.includes('--help')) { // --help argument
    showHelp(version);
}
else if (process.argv.includes("--version")) {
    checkForUpdates(version);
    console.log("Version " + version);
} else if (process.argv.includes('--enableUpdateChecks')) {
    if (/(true|false)/i.test(process.argv[process.argv.indexOf('--enableUpdateChecks') + 1])) {
        const userChoice: boolean = JSON.parse(process.argv[process.argv.indexOf('--enableUpdateChecks') + 1]);
        if (fs.existsSync(`${os.homedir()}/.profilelauncherconfig`)) {
            fs.writeFileSync(`${os.homedir()}/.profilelauncherconfig`, JSON.stringify({checkForUpdatesOnLaunch: userChoice}, null, 2));
            console.log(`Update checking has been ${userChoice ? "enabled": "disabled"}.`);
        } else {
            console.log("The config file doesn't seem to be present on your system. Creating it for you now...")
            fs.writeFileSync(`${os.homedir()}/.profilelauncherconfig`, JSON.stringify({checkForUpdatesOnLaunch: userChoice}, null, 2));
            setTimeout(() => { console.log(`Created config file! Updates have been ${userChoice ? "enabled" : "disabled"}.`) }, 500); // add a small delay because it feels nice
        }
    } else {
        console.error(`Invalid parameter specified for --enableUpdateChecks`);
    }
} else if (process.argv.includes('--username') || process.argv.includes('-u')) { // specify username on the command line with --username or -u arg, checks if valid content-wise with .test()
    const arg = process.argv.includes('--username') ? '--username' : '-u';
    if (process.argv[process.argv.indexOf(arg) + 1] !== undefined) {
        const username = process.argv.includes('--username') ? process.argv[process.argv.indexOf('--username') + 1] : process.argv[process.argv.indexOf('-u') + 1]; // self explanatory
        if (/^(?=[^_]+_?[^_]+$)\w{3,20}$/i.test(username)) {
            checkForUpdates(version);
            getProfile(username);
        } else {
            console.error(`Invalid parameter specified for ${process.argv.includes('--username') ? '--username' : '-u'}`);
        }
    } else {
        console.error(`Parameter required for argument '${process.argv.includes('--username') ? '--username' : '-u'}'`);
    }
} else if (process.argv[2] === undefined) { // for those who don't use command line args
    checkForUpdates(version);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    setTimeout(() => { // let update checks finish first with little delay to actual program startup
        console.log(`Welcome to ProfileLauncher v${version}.\n`);
        rl.question("Enter a username: ", username => {
            if (/^(?=[^_]+_?[^_]+$)\w{3,20}$/i.test(username) === true) {
                getProfile(username);
                rl.close();
            } else {
                console.log("Invalid username provided!\n");
                rl.close();
                makeWindowPersist();
            }
        });
    }, 200);
} else { // complains about invalid arguments
    let args = [...process.argv];
    args.slice(2); // remove the dumb file paths from the args array
    let validArgs = ['--username', '-u', '--help', '--version', '--enableUpdateChecks'];
    let invalidArgs = args.filter(v => v.startsWith('-') && !validArgs.includes(v)); // remove the legitimate args if there are any, so that we only complain about the invalid ones
    for (let i = 0; i < invalidArgs.length; i++) {
        invalidArgs[i] = `'${invalidArgs[i]}'`;
    }
    if (invalidArgs.length > 0) { // I think this always returns true but eh
        console.error(`Invalid argument${invalidArgs.length === 1 ? '' : 's'}: ${invalidArgs.join(", ")}`);
        makeWindowPersist();
    }
}