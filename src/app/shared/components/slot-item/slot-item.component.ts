import { Component, Input } from '@angular/core';
import { DoctorScheduleStateService } from '../../services/states/doctors-states/doctor-schedule-state.service';

@Component({
  selector: 'app-slot-item',
  templateUrl: './slot-item.component.html',
  styleUrls: ['./slot-item.component.scss'],
})
export class SlotItemComponent {
  @Input() item: any;
  constructor(private DoctorScheduleStateService: DoctorScheduleStateService) {}
  selectSlot(data: {}) {
    console.log(data);

    this.DoctorScheduleStateService.sendSelectedSlot(data);
  }
  // formatTime(time: string): string {
  //   const formattedTime = new Date(`1970-01-01T${time}`);
  //   return formattedTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  // }
}
