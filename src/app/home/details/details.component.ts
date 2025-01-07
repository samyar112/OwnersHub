import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { MatIcon } from '@angular/material/icon';
import { SqliteService } from '../../sqlite.service';  // Import the service
import { Owner } from '../../model/owner';  // Import the Owner model

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIcon],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  userForm: FormGroup;
  isFormSubmitted: boolean = false;
  isEditMode: boolean = false;  // Flag to track if we are in edit mode
  currentOwnerId: number = 0;

  constructor(
    private sqliteService: SqliteService, 
    private router: Router,
  ) {
    this.userForm = new FormGroup({
      account: new FormControl('', [Validators.required]),
      owner: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postal: new FormControl('', [Validators.required]),
    });
  }

  populateForm(ownerData: Owner) {
    this.userForm.setValue({
      account: ownerData.accountId,
      owner: ownerData.ownerName,
      name: ownerData.contactName,
      email: ownerData.email,
      phone: ownerData.phone,
      address: ownerData.address,
      city: ownerData.city,
      state: ownerData.state,
      postal: ownerData.zip,
    });
  }

  ngOnInit(): void {
    const ownerDataJson = history.state?.ownerData;
    const isEditMode = history.state?.isEditMode;
  
    if (ownerDataJson) {
      this.isEditMode = isEditMode || false; // If editing, true; else false (view mode)
      this.populateForm(JSON.parse(ownerDataJson)); // Populate the form with the passed data
    }
  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.userForm.valid) {
      const ownerData: Owner = {
        id: this.isEditMode ? this.currentOwnerId : 0,  // If editing, use the existing ID
        accountId: this.userForm.value.account,
        ownerName: this.userForm.value.owner,
        contactName: this.userForm.value.name,
        email: this.userForm.value.email,
        phone: this.userForm.value.phone,
        address: this.userForm.value.address,
        city: this.userForm.value.city,
        state: this.userForm.value.state,
        zip: this.userForm.value.postal
      };
      if (this.isEditMode) {
        this.updateOwnerData(ownerData);  // Update the existing record
      } else {
        this.addOwnerData(ownerData);  // Add a new record
      }
    }
  }

  // Add new owner to the database
  addOwnerData(ownerData: Owner) {
    this.sqliteService.addData(ownerData).then(() => {
      this.router.navigate(['/home'], { queryParams: { newOwner: JSON.stringify(ownerData) } });
      alert('Owner data added successfully!');
    }).catch((error: any) => {
      console.error('Error adding data:', error); 
      alert('Error adding owner data. Please try again.');
    });
  }

  // Update existing owner in the database
  updateOwnerData(ownerData: Owner) {
      // After updating, reload the data (by calling getAllData)
      this.sqliteService.editData(ownerData).then(() => {
        this.sqliteService.getDataById(ownerData.id)
        this.router.navigate(['/home']);
        alert('Owner data updated successfully!');
      }).catch((error: any) => {
        console.error('Error fetching data after update:', error);
      });
  }

  toggleEditMode() {
    this.isEditMode = true;  // When the user clicks "Edit", toggle the mode to true
  }
}