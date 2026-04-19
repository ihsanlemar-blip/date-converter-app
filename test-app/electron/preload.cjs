const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Can be used to securely bridge NodeJS utilities to the frontend
});
