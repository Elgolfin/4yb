const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const dialog = electron.dialog;

// Report crashes to our server.
//electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({});
  mainWindow.maximize();
  
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/app.html');
  
    var template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File...',
                    accelerator: 'CmdOrCtrl+O',
                    role: 'openfile',
                    click: showOpen
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'Debug',
            submenu: [
                {
                    label: 'Reload Application',
                    accelerator: 'CmdOrCtrl+R',
                    role: 'reload',
                    click: reloadApp
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'Shift+CmdOrCtrl+I',
                    role: 'toggleDevTools',
                    click: toggleDeveloperTools
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    role: 'about'
                }
            ]
        }
    ];
    
    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    
    
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});

const jetpack = require('fs-jetpack').cwd(app.getAppPath())
var Datastore = require('nedb');
global.openedFile = 'default.4yb';
global.db_4yb = new Datastore({ filename: global.openedFile, autoload: true });
var showOpen = function() {
	dialog.showOpenDialog({ properties: [ 'openFile'], filters: [{ name: '4yb', extensions: ['4yb', 'json'] }]}, function(filenames){
        if (filenames === undefined) return;
        var filename = filenames[0];
        console.log("Opening file... " + filename);
        global.openedFile = jetpack.inspect(filename).name
        console.log("Global variable has been set: " + global.openedFile);
        global.db_4yb = new Datastore({ filename: global.openedFile, autoload: true })
        // Refresh the application to use the new file
        mainWindow.loadURL('file://' + __dirname + '/app.html');
    });
};

var toggleDeveloperTools = function() {
	mainWindow.webContents.openDevTools();
};

var reloadApp = function() {
    mainWindow.loadURL('file://' + __dirname + '/app.html');
};