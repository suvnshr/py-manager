const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
// const getPackages = require('./utils/getPackages');
// const getPackageDetail = require('./utils/getPackageDetail');
const PipHandler = require('./utils/PipHandler');

let mainWindow;
const pipPackagesHandler = new PipHandler();

function createWindow() {
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
		},
	});

	// Make the application run full screen
	mainWindow.maximize();

	mainWindow.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, 'src/build/index.html')}`,
	);

	// Install the extension if developer mode is ON
	if (isDev) {
		const {
			default: installExtension,
			REACT_DEVELOPER_TOOLS,
		} = require('electron-devtools-installer');

		installExtension(REACT_DEVELOPER_TOOLS)
			.then(name => console.log(name + ' added'))
			.catch(err => console.log(err + ' occurred'));
	}
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

ipcMain.handle('RECEIVE_PACKAGES', function () {
	pipPackagesHandler.getPackages(mainWindow);
});

ipcMain.handle('RECEIVE_LOCAL_DETAIL', function (ev, packageName) {
	pipPackagesHandler.getPackageDetail(mainWindow, packageName);
});

ipcMain.handle('SEARCH_ONLINE', function (ev, packageQuery, orderBy) {
	pipPackagesHandler.searchPythonPackageOnline(
		mainWindow,
		packageQuery,
		orderBy,
	);
});

ipcMain.handle('PACKAGE_UNINSTALL', function (ev, packageName) {
	pipPackagesHandler.uninstallPackage(mainWindow, packageName);
});

ipcMain.handle('PACKAGES_INSTALL', function (ev, packagesData) {
	pipPackagesHandler.installPackage(mainWindow, packagesData);
});

ipcMain.handle('OPEN_LINK', function (ev, URL) {
	pipPackagesHandler.openURLInBrowser(URL);
});

ipcMain.handle('PIP_FILE_DIALOG', function (ev) {
	pipPackagesHandler.openPIPDialog(mainWindow, dialog);
});

ipcMain.handle('PIP_ADDITION', function (ev, pipName, pipPath) {
	pipPackagesHandler.validateAndAddPIP(mainWindow, pipName, pipPath);
});

ipcMain.handle('GET_CURRENT_PIP', function (ev) {
	pipPackagesHandler.sendCurrentPIP(mainWindow);
});

ipcMain.handle('GET_ALL_PIPS', function (ev) {
	pipPackagesHandler.sendAllPIPS(mainWindow);
});

ipcMain.handle('GET_DEFAULT_PIP', function (ev) {
	pipPackagesHandler.sendDefaultPIP(mainWindow);
});

ipcMain.handle('CHANGE_CURRENT_PIP', function (ev, pipName) {
	pipPackagesHandler.changeCurrentPIP(mainWindow, pipName);
});


ipcMain.handle('DELETE_PIP', function (ev, pipName) {
	pipPackagesHandler.deletePIP(mainWindow, pipName);
});
