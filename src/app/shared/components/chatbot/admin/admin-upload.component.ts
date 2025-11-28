import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from './upload.service'; 
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-upload',
  standalone: true, 
  imports: [CommonModule, HttpClientModule], 
  
 templateUrl: './admin-upload.component.html',
})
export class AdminUploadComponent {
  selectedFile: File | null = null;
  selectedFileName: string = '';
  message: string = '';
  isSuccess: boolean = false;
  isUploading: boolean = false;

  constructor(private uploadService: UploadService) { }

  onFileSelected(event: Event): void {
    this.message = '';
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;
    
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.selectedFileName = this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = '';
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.message = 'Please select a file to upload.';
      this.isSuccess = false;
      return;
    }

    this.isUploading = true;
    this.message = 'Indexing started. Please wait...';
    this.isSuccess = false;

    this.uploadService.uploadFile(this.selectedFile)
      .subscribe({
        next: (response) => {
          console.log('Upload success:', response);
          this.message = `Indexing completed successfully. Chatbot is ready to use.`;
          this.isSuccess = true;
          this.isUploading = false;
          this.resetForm();
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.message = `Indexing failed: ${err.message || 'Server/Network error'}`;
          this.isSuccess = false;
          this.isUploading = false;
        }
      });
  }

  private resetForm(): void {
    this.selectedFile = null;
    this.selectedFileName = 'Please select a file to upload.';
  }
}