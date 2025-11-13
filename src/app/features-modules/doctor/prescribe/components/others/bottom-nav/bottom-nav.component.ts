import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TosterService } from 'src/app/shared/services/toster.service';
import { prescriptionApi } from 'src/environments/environment';
import { PrescriptionService } from '../../../services/prescription.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
  Prescription = inject(PrescriptionService);
  Toaster = inject(TosterService);

  MatDialog = inject(MatDialog);
  isLoader: boolean = false;
  @Input() isPreHand = false;
  @Input() appointmentCode = '';
  onClickSaveSubmit() {
    this.isLoader = true;
    this.Prescription.submitPrescription().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.Toaster.customToast(
            'Prescription Saved Successfully',
            'success'
          );

          this.isLoader = false;
          this.Prescription.resetForm();
          window.onload;
          this.Prescription.prescribeForm().markAsPristine();

          const printWindow = window.open(
            `${prescriptionApi}/${res.results.filePath}`,
            '_blank'
          );
          if (printWindow) {
            printWindow.onload = () => {
              printWindow.focus();
              printWindow.print();
            };
          }
        } else {
          this.isLoader = false;
          this.Toaster.customToast('Failed to save prescription', 'error');
        }
      },
      error: () => {
        this.isLoader = false;
        this.Toaster.customToast('Something went wrong', 'error');
      },
    });
  }
  saveAsTemplate() {
    this.MatDialog.open(ConfirmComponent, {});
  }
}
