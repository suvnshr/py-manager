const { exec } = require("child_process");


function execPromise(command) {
    return new Promise(function (resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
                return;
            }

            resolve(stdout.trim());
        });
    });
}

async function execCommand(command) {
    let _error, _stderr, _output;

    try {
        _output = await execPromise(command);
    } catch ({ error, stderr }) {
        _error = error;
        _stderr = stderr;

        console.error("Error while running command: ", command, _stderr);
    }

    return { "output": _output, "error": _error, "stderr": _stderr };
}

module.exports = { execCommand, execPromise };