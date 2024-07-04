import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { SongQueue, updateSongQueue } from "./server"
import electronLocalshortcut from 'electron-localshortcut';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webviewTag: true,
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../ui/index.html"));

  // Open the DevTools.
  // disable file edit, view, window, and help menus
  // mainWindow.setMenu(null);
}

function getQueue(event: Electron.IpcMainEvent) {
  return SongQueue;
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  ipcMain.handle("get_queue", getQueue);
  ipcMain.handle("remove_queue", (event, element: string) => {
    updateSongQueue(SongQueue.filter((song) => song !== element));
  });
  createWindow();
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.on("frame-created", (_, { frame }) => {
    frame.once("dom-ready", () => {
      if (frame.url.startsWith("https://www.youtube.com/")) {
        console.log("bad guy. created??")
        frame.executeJavaScript(`
              console.log("Removing bad guys")
              new MutationObserver(() => {
                  if(
                      document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                  ) location.reload()
              }).observe(document.body, { childList: true, subtree:true });
              `);
      }
    });
    electronLocalshortcut.register(win, 'CommandOrControl+R', () => {
      win.webContents.executeJavaScript("window.dispatchEvent(new KeyboardEvent('keydown',  {'key':'r', 'ctrlKey':true, 'char':'r', 'keyCode':82, 'code':82, 'which':82}))");
    });
    app.on("activate", function() {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();

    });
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
