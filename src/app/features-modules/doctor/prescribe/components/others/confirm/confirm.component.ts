import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { PrescriptionService } from '../../../services/prescription.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent {
  templateName = '';
  loader = false;
  private Prescription = inject(PrescriptionService);
  public MatDialog = inject(MatDialogRef<ConfirmComponent>);
  confirmSaveAsTemplate() {
    this.loader = true;
    try {
      this.Prescription.saveAsTemplate(this.templateName).subscribe({
        next: (res) => {
          this.loader = false;
          // this.Prescription.resetForm();
          this.MatDialog.close();
        },
      });
    } catch (error) {}
  }
}
