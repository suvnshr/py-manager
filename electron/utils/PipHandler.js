const { exec } = require('child_process');

class PipHandler {
	// getting pip reference
	getPip() {
		return 'pip3';
	}

	// getting installed packages
	getPackages(mainWindow) {
		const PIP = this.getPip();

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

	// getting individual package detail
	getPackageDetail(mainWindow, packageName) {
		const PIP = this.getPip();

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

			mainWindow.webContents.send('SEND_LOCAL_DETAIL', localPackageData);
		});
	}
}

module.exports = PipHandler;
