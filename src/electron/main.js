const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const getPackages = require('./utils/getPackages');
const getPackageDetail = require('./utils/getPackageDetail');

let mainWindow;

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
			: `file://${path.join(__dirname, '../build/index.html')}`,
	);

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
	getPackages(mainWindow);
});


ipcMain.handle('RECEIVE_LOCAL_DETAIL', function (ev, packageName) {
	getPackageDetail(mainWindow, packageName);
})
