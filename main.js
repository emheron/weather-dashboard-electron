const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#2e2c29',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  win.loadFile('index.html');
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);
