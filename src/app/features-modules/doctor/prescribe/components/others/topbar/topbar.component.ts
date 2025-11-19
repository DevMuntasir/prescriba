import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { PrescriptionService } from '../../../services/prescription.service';
import { UploadImageComponent } from '../upload-image/upload-image.component';
import { MatDialog } from '@angular/material/dialog';
import { TemplatesComponent } from '../templates/templates.component';
import { DocumentsAttachmentService } from 'src/app/api/services';
import { PreviousDocumentsDialogComponent } from '../previous-documents-dialog/previous-documents-dialog.component';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';

import { PatientSelectorDialogComponent, PatientInfoPayload } from './patient-selector-dialog/patient-selector-dialog.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  @Input() doctorId!: any;
  @Input() appointmentId!: any;
  @Input() patientId!: any;
  @Input() isPreHand: boolean = false;
  @Output() enterFullScreen: EventEmitter<void> = new EventEmitter();
  @Output() onClickSelectChamber: EventEmitter<void> = new EventEmitter();
  docFile: string = '';
  docFileUrl: any[] = [];
  public picUrl = `${environment.apis.default.url}/`;
  docLoader: boolean = false;
  private Router = inject(Router);
  private Prescription = inject(PrescriptionService);
  private DocumentsAttachmentService = inject(DocumentsAttachmentService);
  private AuthService = inject(AuthService);
  isChecked = false;
  dialog = inject(MatDialog);
  isTemplateLoad: boolean = false;
  goBack() {
    if (this.isPreHand) {
      this.Router.navigate(['doctor/dashboard']);
    } else {
      this.Router.navigate(['doctor/appointments']);
    }
  }

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.Prescription.setIsHeader(!this.isChecked);
  }
  openImageUpload() {
    this.dialog.open(UploadImageComponent, {
      width: '500px',
    });
  }
  showTemplates() {
    this.isTemplateLoad = true;
    const authInfoId = this.AuthService.authInfo()?.id;
    const doctorId = this.doctorId ?? authInfoId;
    if (doctorId) {
      this.Prescription.getPrescriptionTemplates(doctorId).subscribe({
        next: (res) => {
          this.isTemplateLoad = false;
          this.dialog.open(TemplatesComponent, {
            width: '500px',
            data: res.results,
          });
          console.log(res);
        },
        error: () => {
          this.isTemplateLoad = false;
        },
      });
    }
  }
  showPreviousDocuments(id: any) {
    this.docLoader = true;
    this.DocumentsAttachmentService.getAttachmentInfoByEntityTypeAndEntityIdAndAttachmentType(
      'Patient',
      id,
      'PatientPreviousDocuments',
      this.appointmentId
    ).subscribe((at) => {
      if (at) {
        const docFileUrl: any[] = [];
        at.map((e) => {
          let prePaths: string = '';
          var re = /wwwroot/gi;
          prePaths = e.path ? e.path : '';
          this.docFile = prePaths.replace(re, '');
          // console.log(at);
          docFileUrl.push(this.picUrl + this.docFile);
          console.log(this.docFileUrl);
        });
        this.docLoader = false;
        this.dialog.open(PreviousDocumentsDialogComponent, {
          width: '60vw',
          data: docFileUrl,
          height: '100vh',
        });
      }
    });
  }
  openPatientDialog(): void {
    this.dialog
      .open(PatientSelectorDialogComponent, {
        width: '520px',
        data: { doctorId: this.doctorId },
      })
      .afterClosed()
      .subscribe((patient: PatientInfoPayload | undefined) => {
        if (patient) {
          this.Prescription.setPatientInfo(patient);
        }
      });
  }

}
