const { exec } = require('child_process');
const axios = require('axios');
const cheerio = require('cheerio');
const Store = require('electron-store');

const { shell, ipcRenderer } = require('electron');
const store = new Store();

const ALL_PIPS_KEY = 'ALL_PIPS';
const CURRENT_PIP_KEY = 'CURRENT_PIP';
const PIP_FLAGS = '--disable-pip-version-check --no-python-version-warning';

class PipHandler {
	constructor() {
		this.defaultPIP = this.getDefaultPIP();
		this.PIP_FLAGS = PIP_FLAGS;
	}

	getDefaultPIP() {
		// TODO: the default PIP command may be different for different platforms
		return { pipName: 'main', pipPath: 'pip3' };
	}

	// Getting the current PIP
	getCurrentPip() {
		return store.get(CURRENT_PIP_KEY, this.defaultPIP);
	}

	// Get the current PIP path
	getCurrentPIPPath() {
		return this.getCurrentPip().pipPath;
	}

	// Get all the added PIPS not including the default PIP
	_getAllPIPS() {
		return store.get(ALL_PIPS_KEY, {});
	}

	// Get all the added PIPS including the default PIP
	getAllPIPS() {
		const _allPIPS = this._getAllPIPS();
		const defaultPIP = this.defaultPIP;

		_allPIPS[defaultPIP.pipName] = defaultPIP.pipPath;

		return _allPIPS;
	}

	// Delete a PIP from `electron-store`
	deletePIP(mainWindow, pipName) {
		if (pipName !== this.getDefaultPIP().pipName) {
			const _allPIPS = this._getAllPIPS();

			// Check whether the requested `pipName` exists
			// ...in the electron store or not
			// if it exists then delete it
			if (Object.keys(_allPIPS).includes(pipName)) {
				delete _allPIPS[pipName];
				store.set(ALL_PIPS_KEY, _allPIPS);
			}

			// If the user has deleted the `CURRENT_PIP`
			// then set the `CURRENT_PIP` to default
			if (pipName === this.getCurrentPip().pipName) {
				this.changeCurrentPIP(mainWindow, pipName, true);
			} else {
				// Since `changeCurrentPIP` is not called, we have to manually send PIP data to `mainWindow`
				// `changeCurrentPIP` sends PIP data to `mainWindow` implicitly
				this.sendCurrentPIPAndAllPIPS(mainWindow);
			}
		}
	}

	// Send the default PIP to `mainWindow`
	sendDefaultPIP(mainWindow) {
		mainWindow.webContents.send(
			'DEFAULT_PIP_RESULTS',
			this.getDefaultPIP(),
		);
	}

	// Send the current PIP to `mainWindow`
	sendCurrentPIP(mainWindow) {
		mainWindow.webContents.send(
			'CURRENT_PIP_RESULTS',
			this.getCurrentPip(),
		);
	}

	// Add a PIP to `ALL_PIPS_KEY` in store
	addPIPToAllPIPS(pipName, pipPath) {
		// The list of PIPs without the default PIP
		const _allPIPS = this._getAllPIPS();

		_allPIPS[pipName] = pipPath;
		store.set(ALL_PIPS_KEY, _allPIPS);
	}

	// Send all added PIPS to `mainWindow`
	sendAllPIPS(mainWindow) {
		mainWindow.webContents.send('ALL_PIPS_RESULTS', this.getAllPIPS());
	}

	// open URL in browser
	openURLInBrowser(URL) {
		shell.openExternal(URL);
	}

	// getting installed packages
	getPackages(mainWindow) {
		const PIP = this.getCurrentPIPPath();

		exec(
			`${PIP} list --format json ${this.PIP_FLAGS}`,
			(error, stdout, stderr) => {
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
			},
		);
	}

	// getting individual package detail
	getPackageDetail(mainWindow, packageName) {
		const PIP = this.getCurrentPIPPath();

		exec(
			`${PIP} show -V ${packageName} ${this.PIP_FLAGS}`,
			(error, stdout, stderr) => {
				if (error) {
					console.log(
						`Error getting package details: ${error.message}`,
					);
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
			},
		);
	}

	searchPythonPackageOnline(mainWindow, packageName, orderBy) {
		let filter = '';
		const filterOptions = {
			Relevance: '',
			Trending: '-zscore',
			Recent: '-created',
		};

		if (Object.keys(filterOptions).includes(orderBy)) {
			filter = filterOptions[orderBy];
		}

		axios
			.get(`https://pypi.org/search/?q=${packageName}&o=${filter}`)
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

					let pypiPackageData = {
						href:
							'https://pypi.org' + packageAnchorTag.attribs.href,
						packageDescription,
					};

					matchedPackages[packageName] = pypiPackageData;
				}

				mainWindow.webContents.send('SEARCH_DATA', matchedPackages);
			})
			.catch(err => {
				console.log(`Error searching PyPi: ${err}`);
				mainWindow.webContents.send('SEARCH_DATA', -1);
			});
	}

	uninstallPackage(mainWindow, packageName) {
		const PIP = this.getCurrentPIPPath();

		exec(
			`${PIP} uninstall ${packageName} --yes ${this.PIP_FLAGS}`,
			(error, stdout, stderr) => {
				let uninstallMessage = `${packageName} is successfully removed`;

				if (error) {
					uninstallMessage = `Error while uninstalling ${packageName}: ${error}`;
				}

				if (stderr) {
					uninstallMessage = `Error while uninstalling ${packageName}: ${stderr}`;
				}

				mainWindow.webContents.send(
					'UNINSTALL_MESSAGE',
					uninstallMessage,
				);

				// getPackages(mainWindow);
			},
		);
	}

	// Validate the PIP name and path and then add it to `electron-store`
	validateAndAddPIP(mainWindow, pipName, pipPath) {
		let pipNameValid = true;
		let pipNameError = '';

		let pipPathValid = true;
		let pipPathError = '';

		// The list of PIPs including the default PIP
		const allPIPS = this.getAllPIPS();

		exec(
			`${pipPath} --version ${this.PIP_FLAGS}`,
			(error, stdout, stderr) => {
				// If any errors occurred in the command execution 
				if (error) {
					pipPathValid = false;
					pipPathError = 'Choose a valid PIP path';
				}

				try {
					// Check whether the first word of the output is `pip`
					// and whether the second word is version string or not

					// ...We check whether a string is a version string or not 
					// by using `parseFloat`

					let pipVersionOutputArray = stdout.split(' ');

					let firstWord = pipVersionOutputArray[0].toLowerCase();
					let secondWord = parseFloat(pipVersionOutputArray[1]);

					if (!firstWord === 'pip' || isNaN(secondWord)) {
						pipPathValid = false;
						pipPathError = 'Choose a valid PIP path';
					}
				} catch (err) {
					console.log('Warning for validating PIP:', err);
					pipPathValid = false;
					pipPathError = 'Choose a valid PIP path';
				}

				// Check whether `pipName` is already in the store or not
				if (typeof allPIPS[pipName] !== 'undefined') {
					pipNameValid = false;
					pipNameError = 'A PIP with this name already added';
				}

				// Check whether `pipPath` is already in the store or not
				if (Object.values(allPIPS).includes(pipPath)) {
					pipPathValid = false;
					pipPathError = 'A PIP with this path is already added';
				}

				// The name of the PIP should be not empty
				if (pipName.length === 0) {
					pipNameValid = false;
					pipNameError = 'PIP name cannot be empty';
				}

				// The PIP path should be not empty
				if (pipPath.length === 0) {
					pipPathValid = false;
					pipPathError = 'PIP path cannot be empty';
				}

				if (pipNameValid && pipPathValid) {
					this.addPIPToAllPIPS(pipName, pipPath);
					this.setCurrentPIP(pipName, pipPath);

					this.sendCurrentPIPAndAllPIPS(mainWindow);
				}

				mainWindow.webContents.send(
					'PIP_ADDITION_RESULTS',
					pipNameValid && pipPathValid,
					pipNameError,
					pipPathError,
				);
			},
		);
	}

	// Set `CURRENT_PIP_KEY` in `electron-store`
	setCurrentPIP(pipName, pipPath) {
		store.set(CURRENT_PIP_KEY, { pipName, pipPath });
	}

	sendCurrentPIPAndAllPIPS(mainWindow) {
		this.sendCurrentPIP(mainWindow);
		this.sendAllPIPS(mainWindow);
	}

	changeCurrentPIP(mainWindow, pipName, setDefault = false) {
		const allPIPS = this.getAllPIPS();

		// If the user selects the default PIP
		// then unset `CURRENT_PIP_KEY`
		// OR
		// if `setDefault` is `true` then unset the `CURRENT_PIP_KEY
		if (pipName === this.defaultPIP.pipName || setDefault) {
			store.delete(CURRENT_PIP_KEY);
		} else {
			// Set the `CURRENT_PIP_KEY` if default PIP is not selected
			this.setCurrentPIP(pipName, allPIPS[pipName]);
		}

		// Send `CURRENT_PIP_KEY` and `ALL_PIPS`
		this.sendCurrentPIPAndAllPIPS(mainWindow);
	}

	openPIPDialog(mainWindow, dialog) {
		dialog
			.showOpenDialog({
				title: 'Choose a PIP path',
				buttonLabel: 'Select PIP',
				properties: ['openFile'],
			})
			.then(dialogData => {
				let pipPath = '';

				if (!dialogData.canceled) {
					pipPath = dialogData.filePaths[0];
				}

				mainWindow.webContents.send(
					'PIP_FILE_DIALOG_RESULTS',
					pipPath,
					dialogData.cancelled,
				);
			})
			.catch(err => console.log(err));
	}

	installPackage(mainWindow, packagesData) {
		let installCommand = '';

		Object.entries(packagesData).forEach(
			([packageName, packageVersion]) =>
				(installCommand += ` ${packageName}==${packageVersion}`),
		);

		const PIP = this.getCurrentPIPPath();
		installCommand = PIP + ' install' + installCommand;

		exec(`${installCommand} ${this.PIP_FLAGS}`, (error, stdout, stderr) => {
			mainWindow.send('INSTALL_OUTPUT', stdout);

			let packageInstallStatus = {};

			Object.entries(packagesData).forEach(
				([packageName, packageVersion]) => {
					exec(
						`${PIP} show ${packageName} ${this.PIP_FLAGS}`,
						(_error, _stdout, _stderr) => {
							let message = '';
							let error = false;

							if (
								stderr.includes('Package(s) not found:') ||
								_error
							) {
								message = `Error installing ${packageName}`;
								error = true;
							} else {
								message = `${packageName} ${packageVersion} was successfully installed.`;
							}

							packageInstallStatus[packageName] = {
								packageVersion,
								message,
								error,
							};

							if (
								Object.keys(packageInstallStatus).length ===
								Object.keys(packagesData).length
							) {
								mainWindow.send(
									'PACKAGE_STATUS_AFTER_INSTALL',
									packageInstallStatus,
								);
							}
						},
					);
				},
			);
		});
	}
}

module.exports = PipHandler;
