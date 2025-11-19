import { HospitalStateService } from '../../services/states/hospital-state.service';
import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SectionHeaderComponent {
  headingText = input<any>();
  buttonText = input<any>();
  iconClass = input<any>();
  openForm = output<void>();

  private hospitalStateService = inject(HospitalStateService);
  buttonStatus = toSignal(this.hospitalStateService.getHospitalScheduleFormEvent(), { initialValue: false });
}
