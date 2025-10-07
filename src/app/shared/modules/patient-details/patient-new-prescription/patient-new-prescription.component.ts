import { Component, Input } from '@angular/core';
import { PrescriptionPdf } from 'src/app/shared/services/prescription/prescription.service';
import { prescriptionApi } from 'src/environments/environment';

@Component({
  selector: 'app-patient-new-prescription',
  templateUrl: './patient-new-prescription.component.html',
  styleUrl: './patient-new-prescription.component.scss',
})
export class PatientNewPrescriptionComponent {
  @Input() newPrescriptionDetails!: PrescriptionPdf[];
  showPdf(path: string) {
    const printWindow = window.open(`${prescriptionApi}/${path}`, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  }
}
