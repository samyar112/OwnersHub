import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 
import { MatIcon } from '@angular/material/icon';
import { SqliteService } from '../../sqlite.service'; 
import { Owner } from '../../model/owner';

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
  isEditMode: boolean = false; 
  isViewMode: boolean = false;
  ownerId: number | null = null;
  mode: string | undefined; 
  originalAccountId!: Number;

  constructor(
    private sqliteService: SqliteService, 
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.userForm = new FormGroup({
      account: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(4),
        Validators.maxLength(4)]),
      owner: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
        Validators.minLength(10)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [
        Validators.required, 
        Validators.minLength(2),]),
      postal: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(5)]),
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
    this.ownerId = +this.route.snapshot.paramMap.get('id')!;
    // Accessing the 'mode' query parameter to check if it's 'edit' or 'view'
    this.mode = this.route.snapshot.queryParamMap.get('mode')!;
    this.isEditMode = this.mode === 'edit';
    this.isViewMode = this.mode === 'view';
    this.fetchData();
  }
  
  fetchData(): void {
    // If ownerId exists, fetch the owner data
    if (this.ownerId) {
      this.sqliteService.getDataById(this.ownerId).then((ownerData: Owner) => {
        this.originalAccountId = ownerData.accountId;
        // Populate the form for either 'edit' or 'view' mode
        this.isEditMode ? this.populateForm(ownerData) : this.viewOwnerData(ownerData);
      }).catch((error: any) => {
        console.error('Error fetching owner data:', error);
      });
    }
  }
  
  // Function to make form fields readonly in "view" mode
  viewOwnerData(ownerData: Owner) {
    this.populateForm(ownerData);

    if (this.isViewMode) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.disable();
      });
    }
  }

  changeViewtoEdit() {
    this.isEditMode = true;
    this.isViewMode = false;
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.enable();
    });
  }

  private async checkAccountID(accountId: number) { 
    try {
      const existingOwner = await this.sqliteService.getAccountId(accountId);
      return !!existingOwner;

    } catch (error) {
      console.error('Error checking account ID:', error);
      alert('Error checking account ID. Please try again.');
      return false;
    }
  }

  isAccountChanged(newAccountId: number): boolean {
    return this.originalAccountId !== newAccountId;
  }

  async onSubmit() {
    this.isFormSubmitted = true;
  
    if (this.userForm.valid) {
      const accountId = +this.userForm.value.account;

      if (this.isEditMode && this.isAccountChanged(accountId)) {
        const accountExists = await this.checkAccountID(accountId);
  
        if (accountExists) {
          alert('Account ID already exists. Please choose a different account ID.');
          return; 
        }
      }
  
      // Create the owner data object with the form values
      const ownerData: Owner = {
        id: this.ownerId,
        accountId: accountId,
        ownerName: this.userForm.value.owner,
        contactName: this.userForm.value.name,
        email: this.userForm.value.email,
        phone: +this.userForm.value.phone,  
        address: this.userForm.value.address,
        city: this.userForm.value.city,
        state: this.userForm.value.state,
        zip: +this.userForm.value.postal,  
      };
  
      if (this.isEditMode) {
        this.updateOwnerData(ownerData);  
      } else {
        this.addOwnerData(ownerData);  
      }
    } else {
      console.log('Form is invalid:', this.userForm.errors); 
    }
  }
  
    // Add new owner to the database
  private async addOwnerData(ownerData: Owner) {
    try { 
      const accountExists = await this.checkAccountID(ownerData.accountId);
    
      if (accountExists) {
        alert('Account ID already exists. Please choose a different account ID.');
        return;  
      }
      await this.sqliteService.addData(ownerData);  
      this.router.navigate(['/home']); 
      alert('Owner data added successfully!');
    } catch (error) {
      console.error('Error adding data:', error); 
      alert('Error adding owner data. Please try again.');
    }
  }

  // Update existing owner in the database
  private async updateOwnerData(ownerData: Owner) {
    try {
      await this.sqliteService.editData(ownerData);  
      this.router.navigate(['/home']); 
      alert('Owner data updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating owner data. Please try again.');
    }
  }
}
