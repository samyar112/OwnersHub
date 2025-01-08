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
    width: 1250,
    height: 900,
    resizable: true,
    minWidth: 800,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadFile('dist/owners-hub/browser/index.html');
  // // Open DevTools automatically
  // win.webContents.openDevTools();
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
    } 
  });
  return db;
}

// Handle creating the table
ipcMain.handle('createTable', async () => {
  const db = getDb();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS owners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Automatically increments starting from 1
      accountId INTEGER NOT NULL,            -- Non-primary key field
      ownerName TEXT NOT NULL,               -- Required field
      contactName TEXT NOT NULL,             -- Required field
      email TEXT NOT NULL,                   -- Required field
      phone TEXT NOT NULL,                   -- Required field
      address TEXT NOT NULL,                 -- Required field
      city TEXT NOT NULL,                    -- Required field
      state TEXT NOT NULL,                   -- Required field
      zip TEXT NOT NULL                      -- Required field
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

// Handle adding new data for owners
ipcMain.handle('addData', async (event, data) => {
  const db = getDb();
  const insertQuery = `
    INSERT INTO owners (accountId, ownerName, contactName, email, phone, address, city, state, zip)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return new Promise((resolve, reject) => {
    db.run(insertQuery, [
      data.accountId,  // accountId
      data.ownerName,   // owner_name
      data.contactName, // contact_name
      data.email,       // email
      data.phone,       // phone
      data.address,     // address
      data.city,        // city
      data.state,       // state
      data.zip          // zip
    ], function (err) {
      if (err) {
        reject('Error adding data: ' + err.message);
      } else {
        resolve('Data added successfully with ID: ' + this.lastID);
      }
    });
    db.close(); // Close the db connection after the operation
  });
});

// Handle editing data for owners
ipcMain.handle('editData', async (event, data) => {
  const db = getDb();
  const updateQuery = `
    UPDATE owners 
    SET accountId = ?, ownerName = ?, contactName = ?, email = ?, phone = ?, 
        address = ?, city = ?, state = ?, zip = ? 
    WHERE id = ?
  `;

  return new Promise((resolve, reject) => {
    db.run(updateQuery, [
      data.accountId,   // accountId
      data.ownerName,    // owner_name
      data.contactName,  // contact_name
      data.email,        // email
      data.phone,        // phone
      data.address,      // address
      data.city,         // city
      data.state,        // state
      data.zip,          // zip
      data.id            // id (primary key) to update the correct record
    ], function (err) {
      if (err) {
        reject('Error updating data: ' + err.message);
      } else {
        resolve('Data updated successfully');
      }
      db.close(); // Close the db connection after the operation
    });
  });
});

// Handle deleting data for owners
ipcMain.handle('deleteData', async (event, id) => {
  const db = getDb();
  const deleteQuery = `DELETE FROM owners WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(deleteQuery, [id], function (err) {
      if (err) {
        reject('Error deleting data: ' + err.message);
      } else {
        resolve('Data deleted successfully');
      }
      db.close(); // Close the db connection after the operation
    });
  });
});

// Handle getting all data for owners
ipcMain.handle('getAllData', async () => {
  const db = getDb();
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM owners';
    db.all(query, [], (err, rows) => {
      if (err) {
        reject('Error fetching owners: ' + err.message);
      } else {
        // Map rows to the correct owner model format
        const owners = rows.map(row => ({
          id: row.id,          // Now including 'id'
          accountId: row.accountId,
          ownerName: row.ownerName,
          contactName: row.contactName,
          email: row.email,
          phone: row.phone,
          address: row.address,
          city: row.city,
          state: row.state,
          zip: row.zip
        }));
        resolve(owners);  // Return the result rows mapped to Owner model
      }
      db.close();  // Close the db connection after the operation
    });
  });
});

// Handle getting an owner by ID
ipcMain.handle('getDataById', async (event, id) => {
  const db = getDb();
  const selectQuery = `SELECT * FROM owners WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.get(selectQuery, [id], (err, row) => {
      if (err) {
        reject('Error fetching owner by ID: ' + err.message);
      } else {
        // Map the row to the Owner model
        if (row) {
          resolve({
            id: row.id,          // Now including 'id'
            accountId: row.accountId,
            ownerName: row.ownerName,
            contactName: row.contactName,
            email: row.email,
            phone: row.phone,
            address: row.address,
            city: row.city,
            state: row.state,
            zip: row.zip
          });
        } else {
          resolve(null); // Return null if no owner is found with the provided accountId
        }
      }
      db.close();  // Close the db connection after the operation
    });
  });
});
