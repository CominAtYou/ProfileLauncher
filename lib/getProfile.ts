import https = require('https');
import { makeWindowPersist } from './windowPersist';
import open = require('open');
export function getProfile(username: String) {
    const requestOptions = {
        hostname: 'api.roblox.com',
        port: 443,
        path: `/users/get-by-username?username=${username}`,
        method: 'GET'
    };
    const request = https.request(requestOptions, res => {
        res.on('data', d => {
            const data = JSON.parse(d);
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
        console.error("Something happened. Don't fret, just try again. If this continues to happen, please open an issue on GitHub (https://github.com/CominAtYou/ProfileLauncher/issues/) and provide the following message:\n\n", error);
        makeWindowPersist();
    });
    request.end();
}