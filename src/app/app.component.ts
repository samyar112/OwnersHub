import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Owners Hub';
  inputValue: string = '';
  
  // errorMessage = signal('');
  showError: boolean = false;

  onSubmit() {
    if (!this.inputValue) {
      // If input is empty, show error message
      this.showError = true;
    } else {
      // Otherwise, reset the error message
      this.showError = false;
      console.log('Form submitted successfully with pin:', this.inputValue);
      // You can handle the form submission here, e.g., send to an API
    }
  }

}

