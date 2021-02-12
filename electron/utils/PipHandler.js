const { exec } = require('child_process');
const axios = require('axios');
const cheerio = require('cheerio');

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

	searchPythonPackageOnline(mainWindow, packageName) {
		axios
			.get(`https://pypi.org/search/?q=${packageName}`)
			.then(res => {
				const $ = cheerio.load(res.data);

				const matchedPackages = {};

				// a.package-snippet's
				for (const packageAnchorTag of $('a.package-snippet')) {
					
					// a.package-snippet > h3.package-snippet__title > span.package-snippet__name
					const packageName =
						packageAnchorTag.children[1].children[1].children[0]
							.data;

					// a.package-snippet > p.package-snippet__description
					const packageDescriptionPTag = packageAnchorTag.children[3];

					let packageDescription = '';

					// Check if the content of P tag is empty or not
					if (packageDescriptionPTag.children.length) {
						packageDescription =
							packageDescriptionPTag.children[0].data;
					}

					matchedPackages[packageName] = packageDescription;
				}

				mainWindow.webContents.send('SEARCH_DATA', matchedPackages);
			})
			.catch(err => {
				console.log(`Error searching PyPi: ${err}`);
				mainWindow.webContents.send('SEARCH_DATA', -1);
			});
	}
}

module.exports = PipHandler;
