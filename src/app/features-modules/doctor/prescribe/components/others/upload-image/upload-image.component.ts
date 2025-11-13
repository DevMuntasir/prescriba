import { TosterService } from './../../../../../../shared/services/toster.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { prescriptionApi } from 'src/environments/environment';
import { PrescriptionService } from './../../../services/prescription.service';
import { UploadImageService } from './../../../services/upload-image.service';

@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.scss',
})
export class UploadImageComponent {
  imageForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
isLoading = false
  constructor(
    private fb: FormBuilder,
    private PrescriptionService: PrescriptionService,
    private dialogRef: MatDialogRef<UploadImageComponent>,
    private UploadImageService: UploadImageService,
    private TosterService: TosterService
  ) {
    this.imageForm = this.fb.group({
      image: [null],
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.imageForm.patchValue({ image: file });

      // Preview Image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.imageForm.patchValue({ image: null });
  }

  submitForm() {
    if (this.imageForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('File', this.selectedFile);
      try {
        this.isLoading = true
        this.UploadImageService.uploadPrescriptionImage(formData).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              const imageUrl = `${prescriptionApi}/Prescriptions/${res.results.uploadedPath}`;
              this.PrescriptionService.setUploadImage(imageUrl);
              this.TosterService.customToast(
                'Document uploaded successfully.',
                'success'
              );
              this.isLoading = false
              this.dialogRef.close();
            }
          },
          error: () => {
            this.isLoading = false
            this.TosterService.customToast(
              'Failed to upload document!',
              'error'
            );
          },
        });
      } catch (error) {
        this.isLoading = false
        this.TosterService.customToast('Something went wrong!', 'error');
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
