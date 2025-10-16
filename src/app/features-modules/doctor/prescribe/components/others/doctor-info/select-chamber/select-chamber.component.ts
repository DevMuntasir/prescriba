import { Component, Input, OnInit } from '@angular/core';
import { DoctorChamberDto } from 'src/app/proxy/dto-models';
import { PrescriptionService } from './../../../../services/prescription.service';
import { AuthService } from './../../../../../../../shared/services/auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
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

    private authService: AuthService,
    private prescriptionService: PrescriptionService,

  ) {}

  ngOnInit(): void {
    const doctorProfileId = this.authService.authInfo().id;

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
  }

 
}
