import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrescriptionMasterDto } from 'src/app/proxy/dto-models';
import { ShowPrescriptionModalComponent } from '../../show-prescription-modal/show-prescription-modal.component';

@Component({
  selector: 'app-patient-prescriptions',
  templateUrl: './patient-prescriptions.component.html',
  styleUrls: ['./patient-prescriptions.component.scss'],
})
export class PatientPrescriptionsComponent {
  @Input() prescriptionListDetails!: PrescriptionMasterDto[];
  constructor(public dialog: MatDialog) {}
  openPdfDialog(id: any): void {
    this.dialog.open(ShowPrescriptionModalComponent, {
      maxWidth: '820px',

      data: { prescriptionId: id },
    });
  }
}
