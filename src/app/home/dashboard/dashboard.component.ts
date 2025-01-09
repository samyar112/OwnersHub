import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from "./menu/menu.component";
import { Router, RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SqliteService } from '../../sqlite.service';
import { Owner } from '../../model/owner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatButtonModule, 
    MenuComponent, MatPaginator, MatPaginatorModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  
  displayedColumns: string[] = ['accountId', 'ownerName', 'contactName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'star'];
  dataSource: MatTableDataSource<Owner> = new MatTableDataSource<Owner>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 10;
  totalItems = 0;
 
  
  constructor(
    private sqliteService: SqliteService, 
    private router: Router) {}
  
  ngOnInit() {
    this.createTable();
    this.loadOwners();
  }

  async createTable() {
    try {
      await this.sqliteService.createTable();  // Wait until this resolves
      this.loadOwners();  // Only call this after createTable has completed
    } catch (error) {
      console.error('Error creating table', error);
    }
  }

  async loadOwners() {
    try {
      const owners: Owner[] = await this.sqliteService.getAllData();
      this.dataSource.data = owners;
      this.totalItems = owners.length;
      // Set the data in the table
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.error('Error loading owners:', error); // Handle any error fetching data
    }
  }
 // View action from Menu component
  onView(ownerData: Owner) {
    this.router.navigate(['/new-owner', ownerData.id], { 
      queryParams: { mode: 'view' } });
  }

  // Edit action from Menu component
  onEdit(ownerData: Owner) {
    this.router.navigate(['/new-owner', ownerData.id], { 
      queryParams: { mode: 'edit' } });
  }
   

  // Handle delete functionality (if applicable)
  async onDelete(id: number) {
    try {
      await this.sqliteService.deleteData(id);
      this.loadOwners(); 
      alert('Owner data deleted successfully!');
    } catch (error: any)  {
      console.error('Error deleting data:', error);
      alert('Error deleting owner data. Please try again.');
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
