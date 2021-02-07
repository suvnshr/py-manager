const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
// const getPackages = require('./utils/getPackages');
// const getPackageDetail = require('./utils/getPackageDetail');
const PipHandler = require('./utils/PipHandler');

let mainWindow;
const pipPackagesHandler = new PipHandler();

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

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
			.catch(err => console.log(err + ' occured'));
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
