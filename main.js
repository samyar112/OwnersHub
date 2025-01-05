const { ipcMain } = require('electron');
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

// Error Handling
process.on('uncaughtException', (error) => {
  alert("Error Loading, Close the application", error)
});


// Create window and load the app
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    resizable: true,
    minWidth: 800,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
    }
  });

  win.loadFile('dist/owners-hub/browser/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// Sqlite3 connection
function getDb() {
  const db = new sqlite3.Database(path.join(__dirname, 'sqlite3-data.db'), (err) => {
    if (err) {
      console.error('Database connection failed:', err);
    } else {
      console.log('Database connected!');
    }
  });
  return db;
}

// Handle creating the table
ipcMain.handle('createTable', async () => {
  const db = getDb();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    );
  `;
  
  return new Promise((resolve, reject) => {
    db.run(createTableQuery, (err) => {
      if (err) {
        reject('Error creating table: ' + err.message);
      } else {
        resolve('Table created successfully!');
      }
    });
    db.close(); // Close the db connection after running the query
  });
});

// Handle adding new data
ipcMain.handle('addData', async (event, data) => {
  const db = getDb();
  const insertQuery = `INSERT INTO users (name, email) VALUES (?, ?)`;

  return new Promise((resolve, reject) => {
    db.run(insertQuery, [data.name, data.email], function (err) {
      if (err) {
        reject('Error adding data: ' + err.message);
      } else {
        resolve('Data added successfully with ID: ' + this.lastID);
      }
    });
    db.close(); // Close the db connection after the operation
  });
});

// Handle editing data
ipcMain.handle('editData', async (event, data) => {
  const db = getDb();
  const updateQuery = `UPDATE users SET name = ?, email = ? WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(updateQuery, [data.name, data.email, data.id], function (err) {
      if (err) {
        reject('Error updating data: ' + err.message);
      } else {
        resolve('Data updated successfully');
      }
    });
    db.close(); // Close the db connection after the operation
  });
});

// Handle deleting data
ipcMain.handle('deleteData', async (event, id) => {
  const db = getDb();
  const deleteQuery = `DELETE FROM users WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(deleteQuery, [id], function (err) {
      if (err) {
        reject('Error deleting data: ' + err.message);
      } else {
        resolve('Data deleted successfully');
      }
    });
    db.close(); // Close the db connection after the operation
  });
});

// Handle getting all data
ipcMain.handle('get-all-data', async () => {
  const db = getDb();
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users';
    db.all(query, [], (err, rows) => {
      if (err) {
        reject('Error fetching users: ' + err.message);
      } else {
        resolve(rows); // Return the result rows
      }
    });
    db.close(); // Close the db connection after the operation
  });
});

// Handle getting a user by ID
ipcMain.handle('getDataById', async (event, id) => {
  const db = getDb();
  const selectQuery = `SELECT * FROM users WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.get(selectQuery, [id], (err, row) => {
      if (err) {
        reject('Error fetching user by ID: ' + err.message);
      } else {
        resolve(row); // Return the single user
      }
    });
    db.close(); // Close the db connection after the operation
  });
});
