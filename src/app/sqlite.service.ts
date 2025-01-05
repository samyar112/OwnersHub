import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  constructor() { }

  // Wrapper for creating the table
  createTable() {
    return (window as any).electron.createTable();
  }

  // Wrapper for adding data
  addData(data: { id: number; name: string; email: string }) {
    return (window as any).electron.addData(data);
  }

  // Wrapper for editing data
  editData(data: { id: number; name: string; email: string }) {
    return (window as any).electron.editData(data);
  }

  // Wrapper for deleting data
  deleteData(id: number) {
    return (window as any).electron.deleteData(id);
  }

  // Wrapper for getting all users data
  getAllData() {
    return (window as any).electron.getAllData();
  }

  // Wrapper for getting a single user by ID
  getDataById(id: number) {
    return (window as any).electron.getDataById(id);
  }
}
