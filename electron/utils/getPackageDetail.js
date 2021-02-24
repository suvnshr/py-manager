const getPip = require('./getPip');
// const eventNames = require('../../commons/eventNames');
const { exec } = require('child_process');

function getPackageDetail(mainWindow, packageName) {
	const PIP = getPip();

	exec(`${PIP} show -V ${packageName}`, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error getting package details: ${error.message}`);
			return;
		}

		if (stderr) {
			console.log(`Output error: ${stderr}`);
			return;
		}

		const packageDataJson = stdout;
		const localPackageData = {};
		const lines = packageDataJson.trim().split('\n');

		lines.forEach(line => {
			let [key, ...rest] = line.trim().split(': ');
			
			key = key.toLowerCase().trim();
			let value = rest.join(': ').trim();

			if (key.length > 0) {
				localPackageData[key] = value.trim();
			}
		});

		mainWindow.webContents.send(
			'SEND_LOCAL_DETAIL',
			localPackageData,
		);

	});
}

module.exports = getPackageDetail;
