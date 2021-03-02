const getPip = require('./getPip');
const { exec } = require('child_process');

function getPackages(mainWindow) {
	const PIP = getPip();

	exec(`${PIP} list --format json`, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error getting packages: ${error.message}`);
			return;
		}

		if (stderr) {
			console.log(`Output error: ${stderr}`);
			return;
		}

		const packagesJson = stdout;
		const packagesData = JSON.parse(packagesJson.trim());

		mainWindow.webContents.send('SEND_PACKAGES', packagesData);

	});
}

module.exports = getPackages;
