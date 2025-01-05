const { contextBridge, ipcRenderer } = require('electron');

// Expose the necessary APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Create the table if it doesn't exist
  createTable: () => ipcRenderer.invoke('createTable'),

  // Add new data to the table
  addData: (data) => ipcRenderer.invoke('addData', data),

  // Edit existing data in the table
  editData: (data) => ipcRenderer.invoke('editData', data),

  // Delete data from the table
  deleteData: (id) => ipcRenderer.invoke('deleteData', id),

  // Get all data from the 'users' table
  getAllData: () => ipcRenderer.invoke('get-all-data'),

  // Get a user by their ID
  getDataById: (id) => ipcRenderer.invoke('getDataById', id),
});
