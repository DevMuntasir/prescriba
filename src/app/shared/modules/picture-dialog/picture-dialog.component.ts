import { HttpClient } from '@angular/common/http';
import { DoctorProfileService } from '../../../proxy/services/doctor-profile.service';
import { TosterService } from '../../services/toster.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DegreeDialogComponentnt } from '../../../features-modules/doctor/profile-settings/degree-dialog/degree-dialog.component';

@Component({
  selector: 'app-picture-dialog',
  templateUrl: './picture-dialog.component.html',
  styleUrls: ['./picture-dialog.component.scss'],
})
export class PictureDialogComponent implements OnInit {
  @ViewChild('attachments') attachment: any;
  subs = new SubSink();
  fileList: File[] = [];
  fileNames: any[] = [];
  //formg!: FormGroup;
  fileData = new FormData();
  imagePath: any;
  upload: any;
  auth: any;
  url: any;
  profilePic: string = '';

  private apiUrl = `${environment.apis.default.url}/api`;
  public picUrl = `${environment.apis.default.url}/`;
  profileInfo: any = [];
  doctorId: any;
  constructor(
    private TosterService: TosterService,
    private DoctorProfileService: DoctorProfileService,
    private http: HttpClient,
    private normalAuth: AuthService,
    public dialogRef: MatDialogRef<DegreeDialogComponentnt>
  ) {}

  ngOnInit(): void {
    let authId = this.normalAuth.authInfo().id;
    this.doctorId = authId;
    if (authId) {
      console.log(authId);
      this.getProfileInfo(authId);
    }
  }

  getProfileInfo(id: any): void {
    if (id) {
      this.DoctorProfileService.get(id).subscribe((res) => {
        this.profileInfo = res;

        console.log(res);
      });
    }
  }

  uploadPic() {
    this.fileData.append('entityId', this.profileInfo.id.toString());
    this.fileData.append('entityType', 'Doctor');
    this.fileData.append('attachmentType', 'ProfilePicture');
    this.fileData.append(
      'directoryName',
      'DoctorProfilePicture\\' + this.profileInfo.id.toString()
    );
    if (this.fileList.length > 0) {
      for (let item of this.fileList) {
        let fileToUpload = item;
        this.fileData.append(item.name, fileToUpload);
      }
      // save attachment

      this.http
        .post(`${this.apiUrl}/Common/Documents`, this.fileData)
        .subscribe({
          next: (result: any) => {
            this.TosterService.customToast(
              'Picture Changed Successfully',
              'success'
            );
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.dialogRef.close(false);
            console.log(err);
          },
        });
    }
  }

  onFileChanged(event: any) {
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.fileList.push(selectedFile);
      this.fileNames.push(selectedFile.name);
    }
    if (this.fileList.length > 0) {
      this.checkFileValidation(event);
    }
    this.attachment.nativeElement.value = '';
  }

  removeSelectedFile(index: any) {
    // delete file name from fileNames list
    this.fileNames.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
  }

  checkFileValidation(event: any) {
    let count = event.target.files.length;
    if (count > 0) {
      var allowedFiles = ['image/png', 'image/jpeg', 'image/jpg'];
      const files: File[] = event.target.files;
      this.fileList = Array.from(files);
      for (let i = 0; i < count; i++) {
        if (files[i].size > 5242880) {
          this.fileNames.splice(i, 1);
          this.fileList.splice(i, 1);

          this.TosterService.customToast('Maximum 5MB Accepted', 'warning');
          //this.toastr.warning('Maximum 5MB Accepted.', 'Warning');
        }
        if (!(allowedFiles.indexOf(files[i].type.toLowerCase()) >= 0)) {
          this.fileNames.splice(i, 1);
          this.fileList.splice(i, 1);
          this.TosterService.customToast(
            'Only jpeg & jpg are Accepted.',
            'warning'
          );
        }
      }
    }
  }
}
