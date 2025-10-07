import { Component, Input, OnInit } from '@angular/core';
import { DoctorChamberDto } from 'src/app/proxy/dto-models';
import { PrescriptionService } from './../../../../services/prescription.service';
import { AuthService } from './../../../../../../../shared/services/auth.service';
import { DoctorChamberService } from './../../../../../../../proxy/services/doctor-chamber.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DoctorScheduleService } from 'src/app/proxy/services';
import { map, of, tap } from 'rxjs';

@Component({
  selector: 'app-select-chamber',
  standalone: true,
  imports: [MatCheckboxModule],
  templateUrl: './select-chamber.component.html',
  styleUrl: './select-chamber.component.scss',
})
export class SelectChamberComponent implements OnInit {
  @Input() data!: any;
  chamberList!: DoctorChamberDto[];
  selectedChambers: DoctorChamberDto[] = [];

  constructor(
    private doctorChamberService: DoctorChamberService,
    private authService: AuthService,
    private prescriptionService: PrescriptionService,
    private DoctorScheduleService: DoctorScheduleService
  ) {}

  ngOnInit(): void {
    const doctorProfileId = this.authService.authInfo().id;

    if (doctorProfileId) {
      this.doctorChamberService
        .getDoctorChamberListByDoctorId(doctorProfileId)
        .subscribe((res) => {
          this.chamberList = res;
          this.initializeSelectedChambers();
        });
    }
  }

  initializeSelectedChambers() {
    if (this.data) {
      this.selectedChambers = [...this.data];
    }
  }

  isSelected(chamber: DoctorChamberDto): boolean {
    return this.selectedChambers.some(
      (selected) => selected.chamberName === chamber.chamberName
    );
  }

  onSelectChamber(checked: boolean, item: DoctorChamberDto) {
    console.log(item);

    if (checked) {
      if (this.selectedChambers.length < 2) {
        this.selectedChambers.push(item);
        console.log(item);
      }
    } else {
      this.selectedChambers = this.selectedChambers.filter(
        (chamber) => chamber.chamberName !== item.chamberName
      );
    }
    // TODO
    item.doctorProfileId &&
      this.DoctorScheduleService.getScheduleListByDoctorId(item.doctorProfileId)
        .pipe(
          tap((res) => {
            console.log(res);
          })
        )
        .subscribe((res) => {
          console.log(res);
        }),
      this.prescriptionService.setDoctorInfo({
        chamber: this.selectedChambers,
        schedule: [],
      });
  }

  isDisabled(item: DoctorChamberDto): boolean {
    return this.selectedChambers.length >= 2 && !this.isSelected(item);
  }
}
