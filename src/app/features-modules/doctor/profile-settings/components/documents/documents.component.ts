import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DocumentsAttachmentService } from 'src/app/api/services';
import { TosterService } from 'src/app/shared/services/toster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-doctor-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorDocumentsComponent implements OnChanges {
  @Input() doctorId: number | null = null;
  @Output() updated = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  currentSignatureUrl: string | null = null;
  loading = false;
  uploading = false;
  selectedFileName = '';
  private readonly apiUrl = `${environment.apis.default.url}/api/Common/Documents`;

  constructor(
    private documentsService: DocumentsAttachmentService,
    private http: HttpClient,
    private toaster: TosterService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctorId'] && this.doctorId) {
      this.loadSignature();
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedFileName = file?.name ?? '';
  }

  upload(): void {
    const file = this.fileInput?.nativeElement.files?.[0];

    if (!this.doctorId) {
      this.toaster.customToast('Doctor profile missing.', 'error');
      return;
    }

    if (!file) {
      this.toaster.customToast('Choose a signature file first.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('entityId', String(this.doctorId));
    formData.append('entityType', 'Doctor');
    formData.append('attachmentType', 'DoctorSign');
    formData.append('directoryName', `IdentityDoc\\${this.doctorId}`);
    formData.append(file.name, file);

    this.uploading = true;

    this.http.post(this.apiUrl, formData).subscribe({
      next: () => {
        this.uploading = false;
        this.toaster.customToast('Signature updated.', 'success');
        this.clearFileInput();
        this.loadSignature();
        this.updated.emit();
      },
      error: (error) => {
        this.uploading = false;
        this.toaster.customToast(
          error?.message ?? 'Unable to upload the file right now.',
          'error'
        );
      },
    });
  }

  private loadSignature(): void {
    if (!this.doctorId) {
      this.currentSignatureUrl = null;
      return;
    }

    this.loading = true;
    this.documentsService
      .getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType(
        'Doctor',
        this.doctorId,
        'DoctorSign'
      )
      .subscribe({
        next: (attachment) => {
          this.loading = false;
          if (!attachment?.path) {
            this.currentSignatureUrl = null;
            return;
          }

          // Remove wwwroot (case insensitive) and normalize slashes
          let cleanedPath = attachment.path.replace(/wwwroot/gi, '').replace(/\\/g, '/');

          // Ensure no leading slash to prevent double slashes when joining
          if (cleanedPath.startsWith('/')) {
            cleanedPath = cleanedPath.substring(1);
          }

          this.currentSignatureUrl = `${environment.apis.default.url}/${cleanedPath}`;
        },
        error: () => {
          this.loading = false;
          this.currentSignatureUrl = null;
        },
      });
  }

  private clearFileInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.selectedFileName = '';
  }
}


