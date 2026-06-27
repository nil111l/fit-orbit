const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('fitOrbitDesktop', {
  platform: process.platform
});
