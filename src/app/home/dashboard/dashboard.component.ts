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
  
  ngOnInit(): void {
    this.createTable();
    this.loadOwners();
  }

  createTable() {
    this.sqliteService.createTable().then(() => {
      this.loadOwners();
    }).catch((error: any) => {
      console.error('Error creating table', error);
    });
  }

  loadOwners() {
    this.sqliteService.getAllData().then((owners: Owner[]) => {
      this.totalItems = owners.length
      this.dataSource.data = owners; // Set the data in the table
      this.dataSource.paginator = this.paginator;
    }).catch((error: any) => {
      console.error('Error loading owners:', error); // Handle any error fetching data
    });
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
  onDelete(id: number) {
    this.sqliteService.deleteData(id).then(() => {
      this.loadOwners(); 
      alert('Owner data deleted successfully!');
    }).catch((error: any) => {
      console.error('Error deleting data:', error);
      alert('Error deleting owner data. Please try again.');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
