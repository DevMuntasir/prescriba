import { HospitalStateService } from '../../services/states/hospital-state.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
})
export class SectionHeaderComponent {
  @Input() headingText: any;
  @Input() buttonText: any;
  @Input() iconClass: any;
  @Output() openForm: EventEmitter<void> = new EventEmitter<void>();
  buttonStatus!: boolean;

  constructor(private HospitalStateService: HospitalStateService) {
    // this.HospitalStateService.setHospitalScheduleFormEvent(false);
    this.HospitalStateService.getHospitalScheduleFormEvent().subscribe(
      (res: boolean) => (this.buttonStatus = res)
    );
  }
}
