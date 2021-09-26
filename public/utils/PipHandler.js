const axios = require('axios');
const cheerio = require('cheerio');
const Store = require('electron-store');

const { shell } = require('electron');
const NodeCache = require('node-cache');
const { execCommand } = require('./promExec');

const ALL_PIPS_KEY = 'ALL_PIPS';
const CURRENT_PIP_KEY = 'CURRENT_PIP';
const HAS_ON_BOARDED_KEY = 'HAS_ON_BOARDED';
const DEFAULT_PIP_KEY = 'DEFAULT_PIP';
const PIP_FLAGS = '--disable-pip-version-check --no-python-version-warning';

const store = new Store();
const appCache = new NodeCache({
	stdTTL: 604800, // 604800 seconds = 1 week
	checkPeriod: 86400, // 86400 seconds = 1 day
});

class PipHandler {
	constructor() {
		this.PIP_FLAGS = PIP_FLAGS;
	}

	getDefaultPIP() {
		// Return {pipName: null, pipPath: null}
		return store.get(DEFAULT_PIP_KEY, { pipName: null, pipPath: null });
	}

	setDefaultPIP(pipName, pipPath) {
		store.set(DEFAULT_PIP_KEY, { pipName, pipPath });
	}

	// Getting the current PIP
	getCurrentPip() {
		return store.get(CURRENT_PIP_KEY, this.getDefaultPIP());
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
		const defaultPIP = this.getDefaultPIP();

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

	// Send `HAS_ON_BOARDED_KEY` value to mainWindow
	sendHasOnBoarded(mainWindow) {
		mainWindow.webContents.send(
			'HAS_ON_BOARDED_RESULTS',
			store.get(HAS_ON_BOARDED_KEY, false),
		);
	}

	async isDefaultPIPWorkingAfterOnboarding(mainWindow) {
		const { pipPath } = this.getDefaultPIP();
		const { output } = await execCommand(`${pipPath} --version ${this.PIP_FLAGS}`);
		mainWindow.webContents.send("IS_DEFAULT_PIP_WORKING", typeof output !== "undefined")
	}

	// Check for some default pip commands are working or not
	// If they work then set the `defaultPIP` as there value
	// and inform `mainWindow` about `onBoarding` success
	// If none of them works, then inform `mainWindow` about onBoarding failure
	async startOnBoarding(mainWindow) {
		// Possible PIP commands for all machines
		let possiblePIPs = ['pip3', 'pip'];
		let pipWorking = false;
		let defaultPIPName = 'main';

		for (const pipPath of possiblePIPs) {
			if (!pipWorking) {

				const { pipValid } = await this.validatePIP(defaultPIPName, pipPath);

				if (pipValid) {
					// Set `defaultPIP`
					this.setDefaultPIP(defaultPIPName, pipPath);

					// Set `HAS_ON_BOARDED_KEY` to true in electron-store
					store.set(HAS_ON_BOARDED_KEY, true);
					pipWorking = true;

					// Inform `mainWindow` about onboarding success
					this.sendHasOnBoarded(mainWindow);
				}
			} else { break; }
		}


		// No possible pip paths worked on the machine
		if (!pipWorking) {

			// Inform mainWindow about onBoarding failure
			mainWindow.webContents.send('IS_DEFAULT_PIP_WORKING', false);
		}
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
	async getPackages(mainWindow) {
		const PIP = this.getCurrentPIPPath();

		const { output } = await execCommand(`${PIP} list --format json ${this.PIP_FLAGS}`);

		if (typeof output !== "undefined") {
			const packagesJson = output;
			const packagesData = JSON.parse(packagesJson);

			mainWindow.webContents.send('SEND_PACKAGES', packagesData);
		}
	}

	// getting individual package detail
	async getPackageDetail(mainWindow, packageName) {
		const PIP = this.getCurrentPIPPath();

		const { output: packageDataJson } = await execCommand(`${PIP} show -V ${packageName} ${this.PIP_FLAGS}`);

		if (typeof packageDataJson !== "undefined") {
			const localPackageData = {};
			const lines = packageDataJson.split('\n');

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
		}
	}

	async searchPythonPackageOnline(mainWindow, packageName, orderBy) {
		let filter = '';
		const filterOptions = {
			Relevance: '',
			Trending: '-zscore',
			Recent: '-created',
		};

		if (Object.keys(filterOptions).includes(orderBy)) {
			filter = filterOptions[orderBy];
		}

		let pypiRes;

		try {
			pypiRes = await axios
				.get(`https://pypi.org/search/?q=${packageName}&o=${filter}`);
		} catch (err) {
			console.log(`Error searching PyPi: ${err}`);
			mainWindow.webContents.send('SEARCH_DATA', -1);
		}

		if (typeof pypiRes !== "undefined") {

			const $ = cheerio.load(pypiRes.data);

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

				matchedPackages[packageName] = {
					href:
						'https://pypi.org' + packageAnchorTag.attribs.href,
					packageDescription,
				};;
			}

			mainWindow.webContents.send('SEARCH_DATA', matchedPackages);
		}


	}

	async uninstallPackage(mainWindow, packageName) {
		const PIP = this.getCurrentPIPPath();

		const { error, stderr } = await execCommand(`${PIP} uninstall ${packageName} --yes ${this.PIP_FLAGS}`);

		let uninstallMessage = `${packageName} is successfully removed`;

		if (error || stderr) {
			uninstallMessage = `Error while uninstalling ${packageName}: ${error}`;
		}

		mainWindow.webContents.send(
			'UNINSTALL_MESSAGE',
			uninstallMessage,
		);
	}

	async validatePIP(pipName, pipPath) {

		const { output, error } = await execCommand(`${pipPath} --version ${this.PIP_FLAGS}`);

		let pipNameValid = true;
		let pipNameError = '';

		let pipPathValid = true;
		let pipPathError = '';

		// The list of PIPs including the default PIP
		const allPIPS = this.getAllPIPS();

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

			let pipVersionOutputArray = output?.split(' ');

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

		const pipValid = pipNameValid && pipPathValid;

		return { pipNameValid, pipPathValid, pipNameError, pipPathError, pipValid };
	}


	// Validate the PIP name and path and then add it to `electron-store`
	async validateAndAddPIP(mainWindow, pipName, pipPath) {

		const { pipValid, pipNameError, pipPathError } = await this.validatePIP(pipName, pipPath);

		if (pipValid) {
			this.addPIPToAllPIPS(pipName, pipPath);
			this.setCurrentPIP(pipName, pipPath);

			this.sendCurrentPIPAndAllPIPS(mainWindow);
		}

		mainWindow.webContents.send(
			'PIP_ADDITION_RESULTS',
			pipValid,
			pipNameError,
			pipPathError,
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
		if (pipName === this.getDefaultPIP().pipName || setDefault) {
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

	async installPackage(mainWindow, packagesData) {
		const PIP = this.getCurrentPIPPath();

		let packageDataForInstallCommand = '';

		for (const [packageName, packageVersion] of Object.entries(packagesData)) {
			packageDataForInstallCommand += ` ${packageName}==${packageVersion}`
		}

		const installCommand = PIP + ' install' + packageDataForInstallCommand;

		// Run install command
		const { output, stderr } = await execCommand(`${installCommand} ${this.PIP_FLAGS}`);

		// Send install output to frontend
		mainWindow.webContents.send('INSTALL_OUTPUT', output ?? stderr);

		let packageInstallStatus = {};

		for (const [packageName, packageVersion] of Object.entries(packagesData)) {

			let { error: packageShowCommandError, stderr: packageShowCommandStderr } = await execCommand(`${PIP} show ${packageName} ${this.PIP_FLAGS}`);

			let pkgInstallErr = false;
			let message = `${packageName} ${packageVersion} was successfully installed.`;

			if (
				packageShowCommandError ||
				packageShowCommandStderr?.includes('Package(s) not found:')

			) {
				message = `Error installing ${packageName}`;
				pkgInstallErr = true;
			}

			packageInstallStatus[packageName] = {
				packageVersion, message, error: pkgInstallErr,
			};

			if (
				Object.keys(packageInstallStatus).length ===
				Object.keys(packagesData).length
			) {
				mainWindow.webContents.send(
					'PACKAGE_STATUS_AFTER_INSTALL',
					packageInstallStatus,
				);
			}
		}
	}

	async getPackageDataFromPyPI(mainWindow, packageName, defaultValue = -1) {
		const cacheKeyName = 'pypi-package-data-' + packageName;

		let packageData = appCache.get(cacheKeyName);

		// Handling miss
		if (typeof packageData === "undefined") {
			try {
				const res = await axios.get(
					`https://pypi.org/pypi/${packageName}/json`,
				);
				packageData = res.data;

				// Adding `packageData` to cache
				appCache.set(cacheKeyName, packageData);
			} catch (err) {
				console.log(`Error fetching ${packageName}'s data from PYPI:`);

				packageData = defaultValue;
			}
		}

		mainWindow.webContents.send(
			'PYPI_PACKAGE_DATA_OF_' + packageName,
			packageData,
		);
	}
}

module.exports = PipHandler;
