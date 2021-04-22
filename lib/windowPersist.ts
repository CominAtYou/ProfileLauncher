import readline = require('readline');
export function makeWindowPersist() { // make the window persist for non-cli users
    let yeet = readline.createInterface({input: process.stdin, output: process.stdout});
    yeet.question("Press enter to exit.\n", () => {yeet.close()});
}