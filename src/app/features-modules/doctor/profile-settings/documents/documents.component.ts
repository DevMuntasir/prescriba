import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentsAttachmentService } from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TosterService } from 'src/app/shared/services/toster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  @ViewChild('idAttachments') idAttachment: any;
  @ViewChild('signAttachments') signAttachments: any;

  idFileList: File[] = [];
  idFileNames: any[] = [];

  signFileList: File[] = [];
  signFileNames: any[] = [];

  idFileData = new FormData();
  signFileData = new FormData();
  doctorId: any;

  profPicUrl: any;
  profNidUrl: any;
  profSignUrl: any;

  profileNid: string = '';
  profileSign: string = '';

  private apiUrl = `${environment.apis.default.url}/api`;
  public picUrl = `${environment.apis.default.url}/`;
  nidUploadBtn!: boolean;

  constructor(
    private AuthService: AuthService,
    private http: HttpClient,
    private tosterService: TosterService,
    private doctorDocumentsService: DocumentsAttachmentService
  ) {}
  ngOnInit(): void {
    this.doctorId = this.AuthService.authInfo()?.id;
    this.getSign();
    this.getNID();
  }

  uploadNID() {
    this.idFileData.append('entityId', this.doctorId.toString());
    this.idFileData.append('entityType', 'Doctor');
    this.idFileData.append('attachmentType', 'DoctIdentityDoc');
    this.idFileData.append(
      'directoryName',
      'IdentityDoc\\' + this.doctorId.toString()
    );
    if (this.idFileList.length > 0) {
      for (let item of this.idFileList) {
        let fileToUpload = item;
        this.idFileData.append(item.name, fileToUpload);
      }
      // save attachment
      this.http
        .post(`${this.apiUrl}/Common/Documents`, this.idFileData)
        .subscribe(
          (result: any) => {
            this.tosterService.customToast(
              'NID/Passport Changed Successfully',
              'success'
            );
            this.getNID();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  uploadSign() {
    this.signFileData.append('entityId', this.doctorId.toString());
    this.signFileData.append('entityType', 'Doctor');
    this.signFileData.append('attachmentType', 'DoctorSign');
    this.signFileData.append(
      'directoryName',
      'IdentityDoc\\' + this.doctorId.toString()
    );
    if (this.signFileList.length > 0) {
      for (let item of this.signFileList) {
        let fileToUpload = item;
        this.signFileData.append(item.name, fileToUpload);
      }
      // save attachment
      this.http
        .post(`${this.apiUrl}/Common/Documents`, this.signFileData)
        .subscribe(
          (result: any) => {
            this.tosterService.customToast(
              'Signature Changed Successfully',
              'success'
            );
            console.log(result);

            this.getSign();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  onIdFileChanged(event: any) {
    console.log(event);

    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.idFileList.push(selectedFile);
      this.idFileNames.push(selectedFile.name);
    }
    if (this.idFileList.length > 0) {
      // this.checkIdFileValidation(event);
    }
    this.idAttachment.nativeElement.value = '';
    this.nidUploadBtn = true;
  }

  onSignFileChanged(event: any) {
    console.log(event);

    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.signFileList.push(selectedFile);
      this.signFileNames.push(selectedFile.name);
    }
    if (this.signFileList.length > 0) {
      // this.checkSignFileValidation(event);
    }
    this.signAttachments.nativeElement.value = '';
    // this.signUploadBtn = true;
  }

  removeIdSelectedFile(index: any) {
    // delete file name from fileNames list
    this.idFileNames.splice(index, 1);
    // delete file from FileList
    this.idFileList.splice(index, 1);
  }

  removeSignSelectedFile(index: any) {
    // delete file name from fileNames list
    this.signFileNames.splice(index, 1);
    // delete file from FileList
    this.signFileList.splice(index, 1);
  }

  getNID() {
    this.doctorDocumentsService
      .getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType(
        'Doctor',
        this.doctorId,
        'DoctIdentityDoc'
      )
      .subscribe((at: any) => {
        if (at) {
          let prePaths: string = '';
          var re = /wwwroot/gi;
          prePaths = at.path ? at.path : '';
          this.profileNid = prePaths.replace(re, '');
          this.profNidUrl = this.picUrl + this.profileNid;
        }
        console.log(at);
      });
    this.nidUploadBtn = false;
  }

  getSign() {
    this.doctorDocumentsService
      .getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType(
        'Doctor',
        this.doctorId,
        'DoctorSign'
      )
      .subscribe((at: any) => {
        if (at) {
          let prePaths: string = '';
          var re = /wwwroot/gi;
          prePaths = at.path ? at.path : '';
          this.profileSign = prePaths.replace(re, '');
          this.profSignUrl = this.picUrl + this.profileSign;
        }
        console.log(at);
      });
  }
}
