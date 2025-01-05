import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../../sqlite.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sqlite-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sqlite-test.component.html',
  styleUrls: ['./sqlite-test.component.css']
})
export class SqliteTestComponent implements OnInit {
  data: { id: number; name: string; email: string } = { id: 0, name: '', email: '' }; // For new and existing data
  users: { id: number; name: string; email: string }[] = []; // List of users from DB

  constructor(private sqliteService: SqliteService) {}

  ngOnInit() {
    this.createTable();
    this.loadUsers(); // Load users when the component is initialized
  }

  // Create the table if not exists
  createTable() {
    this.sqliteService.createTable().then((message: any) => {
      console.log(message);
    }).catch((error: any) => {
      console.error('Error creating table:', error);
    });
  }

  // Add a new user or edit an existing one
  addData() {
    // Ensure name and email are not empty
    if (!this.data.name || !this.data.email) {
      alert('Please fill in both fields.');
      return;
    }

    const dataToSend = {
      ...this.data,
      id: this.data.id || 0 // For new records, id should be 0
    };

    this.sqliteService.addData(dataToSend).then((message: any) => {
      console.log(message);
      this.loadUsers();  // Reload users after adding data
      this.resetForm();  // Reset the form after adding data
    }).catch((error: any) => {
      console.error('Error adding data:', error);
    });
  }

  // Edit a user's details
  editData() {
    if (this.data.id === 0 || !this.data.name || !this.data.email) {
      alert('Please select a user to edit.');
      return;
    }

    this.sqliteService.editData(this.data).then((message: any) => {
      console.log(message);
      this.loadUsers();  // Reload users after editing data
      this.resetForm();  // Reset the form after editing
    }).catch((error: any) => {
      console.error('Error editing data:', error);
    });
  }

  // Delete a user
  deleteData(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.sqliteService.deleteData(id).then((message: any) => {
        console.log(message);
        this.loadUsers();  // Reload users after deleting data
      }).catch((error: any) => {
        console.error('Error deleting data:', error);
      });
    }
  }

  // Load users from the database
  loadUsers() {
    this.sqliteService.getAllData().then((users: any[]) => {
      this.users = users;
    }).catch((error: any) => {
      console.error('Error loading users:', error);
    });
  }

  // Reset the form
  resetForm() {
    this.data = { id: 0, name: '', email: '' };  // Reset form to default state
  }

  // Fill the form for editing (called when a user is selected from the table)
  editUser(user: { id: number; name: string; email: string }) {
    this.data = { ...user };  // Pre-fill the form with user data for editing
  }
}
