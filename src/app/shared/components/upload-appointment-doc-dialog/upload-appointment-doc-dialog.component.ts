import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DoctorSpecializationService } from 'src/app/proxy/services';
import { TosterService } from '../../services/toster.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AppointmentDto } from 'src/app/proxy/dto-models';

@Component({
  selector: 'app-upload-appointment-doc-dialog',
  templateUrl: './upload-appointment-doc-dialog.component.html',
  styleUrls: ['./upload-appointment-doc-dialog.component.scss'],
})
export class UploadAppointmentDocDialogComponent {
  selectedFileName!: string;
  selectedFileContent!: SafeResourceUrl;
  // fileList: any;
  fileData!: FormData;
  doctorId: any;
  fileInfo: any;
  private apiUrl = `${environment.apis.default.url}/api`;
  loading = {
    status: false,
    message: 'Send to Doctor',
  };

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<UploadAppointmentDocDialogComponent>,
    private TosterService: TosterService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public appointment: AppointmentDto | undefined
  ) {}

  onFileChanged(event: any): void {
    const file = event.target.files[0];
    this.fileInfo = file;
    if (file) {
      this.selectedFileName = file.name;

      // Use FileReader to read the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        // Check the file type
        if (file.type === 'application/pdf') {
          // If it's a PDF file, display using an iframe
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
          this.selectedFileContent =
            this.sanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(blob)
            );
          console.log(this.selectedFileContent);
        } else {
          // Handle other file types as needed
          // For example, you can display images directly
          this.selectedFileContent =
            this.sanitizer.bypassSecurityTrustResourceUrl(
              URL.createObjectURL(file)
            );
          console.log(this.selectedFileContent);
        }
      };
      reader.readAsArrayBuffer(file);

      // Perform any other actions you need with the file
    }
  }

  savePreviousDocument() {
    if (!this.fileInfo) {
      this.TosterService.customToast('Please select a file!', 'warning');
      return;
    }

    this.loading = {
      status: true,
      message: 'Sending...',
    };
    if (this.selectedFileName && this.appointment?.id) {
      this.fileData = new FormData();
      this.fileData.append(
        'entityId',
        this.appointment?.patientProfileId?.toString() ?? ''
      );
      this.fileData.append(
        'relatedEntityid',
        this.appointment?.id?.toString() || ''
      );
      this.fileData.append('entityType', 'Patient');
      this.fileData.append('attachmentType', 'PatientPreviousDocuments');
      this.fileData.append(
        'directoryName',
        'PatientPreviousDocuments\\' +
          this.appointment?.patientProfileId?.toString()
      );

      this.fileData.append(this.selectedFileName, this.fileInfo);
      //}
      // save attachment
      this.http
        .post(`${this.apiUrl}/Common/Documents`, this.fileData)
        .subscribe(
          (result: any) => {
            this.loading = {
              status: false,
              message: 'Sent',
            };
            this.selectedFileName = '';
            this.selectedFileContent = '';
            this.TosterService.customToast(
              'Your previous document sucessfully send your doctor.',
              'success'
            );
            //  this.dialogRef.close(true);
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  onDeleteFile(): void {
    // Clear selected file information
    this.selectedFileName = '';
    this.selectedFileContent = '';
  }

  isPdf(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }
}
