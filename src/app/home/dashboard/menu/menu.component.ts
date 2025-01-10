import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Owner } from '../../../model/owner';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButtonModule, MatIcon, MatMenuModule],  // Keep your imports
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent {
  @Input() ownerData!: Owner;  // Input property to receive the owner data
  @Output() deleteOwner: EventEmitter<number> = new EventEmitter<number>();  // Event emitter for delete action
  @Output() editOwner: EventEmitter<Owner> = new EventEmitter<Owner>();  // Event emitter for edit action
  @Output() viewOwner: EventEmitter<Owner> = new EventEmitter<Owner>();  // Event emitter for view action

  constructor() {}

  // Emit the edit event when the user selects "Edit"
  onEdit() {
    this.editOwner.emit(this.ownerData);  // Pass the current owner data to the parent for editing
  }

  // Emit the view event when the user selects "View"
  onView() {
    this.viewOwner.emit(this.ownerData);  // Emit the owner data for viewing
  }

  // Emit the delete event when the user selects "Delete"
  onDelete() {
    this.deleteOwner.emit(this.ownerData.id);  // Pass the owner's id to the parent for deletion
  }

  onViewFiles() {
    
  }
}