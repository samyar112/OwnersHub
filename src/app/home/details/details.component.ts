import {Component} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {FormControl, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink} from '@angular/router';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIcon],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  userForm: FormGroup;
  isFormSubmitted: boolean = false;

  constructor() {
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
    
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.userForm.valid) {
      // Logic here to save it in the database
    }
  }
}

