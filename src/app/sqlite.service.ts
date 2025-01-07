import { Injectable } from '@angular/core';
import { Owner } from './model/owner'; // Make sure the path is correct

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  constructor() { }

  // Wrapper for creating the table
  createTable() {
    return (window as any).electron.createTable();
  }

  // Wrapper for adding owner data
  addData(data: Owner) {
    return (window as any).electron.addData(data);
  }

  // Wrapper for editing owner data
  editData(data: Owner) {
    return (window as any).electron.editData(data);
  }

  // Wrapper for deleting owner data by id
  deleteData(id: number) {
    return (window as any).electron.deleteData(id);
  }

  // Wrapper for getting all owners data
  getAllData() {
    
    return (window as any).electron.getAllData();
  }

  // Wrapper for getting a single owner by id
  getDataById(id: number) {
    return (window as any).electron.getDataById(id);
  }
}
