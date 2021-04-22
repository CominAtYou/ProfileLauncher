import fs = require('fs');
import os = require('os');
import https = require('https');
import { makeWindowPersist } from './windowPersist';
export function userUpdatesEnabled() {
    if (fs.existsSync(`${os.homedir()}/.profilelauncherconfig`)) {
        const config = JSON.parse(fs.readFileSync(`${os.homedir()}/.profilelauncherconfig`).toString());
        if (typeof config.checkForUpdatesOnLaunch === 'boolean') {
            return config.checkForUpdatesOnLaunch;
        }
        else {
            console.error(`Error in configuration file: ${config.checkForUpdatesOnLaunch}, a ${typeof config.checkForUpdatesOnLaunch}, is not a boolean (true/false).\nPlease edit the value in ${os.homedir()}/.profilelauncherconfig to resolve this issue.\n`);
            makeWindowPersist();
            process.exit();
        }
    }
    else {
        fs.writeFileSync(`${os.homedir()}/.profilelauncherconfig`, JSON.stringify({ checkForUpdatesOnLaunch: true }, null, 2));
        return true;
    }
}

export function checkForUpdates(version: string) {
    if (userUpdatesEnabled() === true) {
        const requestOptions = {
            hostname: 'arc.cominatyou.com',
            port: 443,
            path: '/sw-versioning/ProfileLauncher.json',
            method: 'GET'
        };
        const request = https.request(requestOptions, res => {
            res.on('data', d => {
                const data = JSON.parse(d);
                if (data.latestVersion !== version) {
                    console.log(`\x1b[1mA new version of ProfileLauncher is available!\x1b[0m\n\nInstalled version: \x1b[31m${version}\x1b[34m => \x1b[32m${data.latestVersion}\x1b[0m\n`);
                    console.log(`Download the new version at ${data.downloadURL}\n`);
                }
            });
        });
        request.on('error', () => { }); // fail silently
        request.end();
    }
}