import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'appointment-header',
  standalone: true,
  imports: [],
  templateUrl: './appointment-header.component.html',
  styleUrl: './appointment-header.component.scss',
})
export class AppointmentHeaderComponent {
  @Input() isScheduleList = false;
  @Input() userType = '';
  @Input() totalCount = 0;
  @Input() exportLoader = false;
  @Output() createAppointmentByAssistant = new EventEmitter<void>();
  @Output() createAppointmentByAgent = new EventEmitter<void>();
  @Output() exportToCSV = new EventEmitter<void>();
}
