import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 
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
  ownerId: number | null = null;
  mode: string = 'view';  // Default mode is view

  constructor(
    private sqliteService: SqliteService, 
    private route: ActivatedRoute,
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
    // Accessing the dynamic 'id' parameter from the route
    this.ownerId = +this.route.snapshot.paramMap.get('id')!;
    
    // Accessing the 'mode' query parameter to check if it's 'edit' or 'view'
    this.mode = this.route.snapshot.queryParamMap.get('mode')!;
    this.isEditMode = this.mode === 'edit';

    // Fetch the data based on the ownerId
    if (this.ownerId) {
      this.sqliteService.getDataById(this.ownerId).then((ownerData: Owner) => {
        // Populate the form with owner data based on 'ownerId'
        if (this.isEditMode) {
          this.populateForm(ownerData);  // Populate the form for editing
        } else {
          this.viewOwnerData(ownerData); // Populate the form for viewing
        }
      }).catch((error: any) => {
        console.error('Error fetching owner data:', error);
      });
    }
  }

  // Function to make form fields readonly in "view" mode
  viewOwnerData(ownerData: Owner) {
    this.populateForm(ownerData);

    // Disable all form fields when in view mode
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.disable(); // Disable the controls to make them readonly
    });
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.userForm.valid) {
      const ownerData: Owner = {
        id: this.ownerId!,
        accountId: this.userForm.value.account,
        ownerName: this.userForm.value.owner,
        contactName: this.userForm.value.name,
        email: this.userForm.value.email,
        phone: this.userForm.value.phone,
        address: this.userForm.value.address,
        city: this.userForm.value.city,
        state: this.userForm.value.state,
        zip: this.userForm.value.postal,
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
      this.router.navigate(['/home']);
      alert('Owner data added successfully!');
    }).catch((error: any) => {
      console.error('Error adding data:', error); 
      alert('Error adding owner data. Please try again.');
    });
  }

  // Update existing owner in the database
  updateOwnerData(ownerData: Owner) {
    this.sqliteService.editData(ownerData).then(() => {
      this.router.navigate(['/home']);
      alert('Owner data updated successfully!');
    }).catch((error: any) => {
      console.error('Error updating data:', error);
    });
  }
}
