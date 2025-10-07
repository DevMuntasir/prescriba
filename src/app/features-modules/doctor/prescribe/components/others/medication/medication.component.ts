import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-medication',
  standalone: true,
  imports: [],
  templateUrl: './medication.component.html',
  styleUrl: './medication.component.scss',
})
export class MedicationComponent {
  @Input() medications: any;
  @Output() openMedicineDialog: EventEmitter<void> = new EventEmitter();
}
