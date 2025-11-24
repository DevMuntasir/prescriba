import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from './upload.service'; 
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-upload',
  // Standalone: true ব্যবহার করে এটি নিশ্চিত করা হলো যে এটি একটি Standalone Component
  standalone: true, 
  // প্রয়োজনীয় মডিউলগুলো ইমপোর্ট করুন
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
      this.message = 'দয়া করে ফাইল নির্বাচন করুন।';
      this.isSuccess = false;
      return;
    }

    this.isUploading = true;
    this.message = 'ফাইল আপলোড এবং ইনডেক্সিং প্রক্রিয়া চলছে...';
    this.isSuccess = false;

    this.uploadService.uploadFile(this.selectedFile)
      .subscribe({
        next: (response) => {
          console.log('Upload success:', response);
          this.message = `✅ সফলভাবে আপলোড ও ইনডেক্সিং সম্পন্ন হয়েছে। চ্যাটবট ব্যবহারের জন্য প্রস্তুত।`;
          this.isSuccess = true;
          this.isUploading = false;
          this.resetForm();
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.message = `❌ আপলোড ব্যর্থ: ${err.message || 'সার্ভার/নেটওয়ার্ক ত্রুটি'}`;
          this.isSuccess = false;
          this.isUploading = false;
        }
      });
  }

  private resetForm(): void {
    // সফল আপলোডের পর ফাইল নির্বাচন রিসেট করা
    this.selectedFile = null;
    this.selectedFileName = 'ফাইল নির্বাচন করুন';
    // ইনপুট রিসেট করার জন্য প্রয়োজন হলে ডিরেক্ট রেফারেন্স ব্যবহার করা যেতে পারে
  }
}