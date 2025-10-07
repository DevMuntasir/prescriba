import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../../environments/environment';
import { DoctorSpecializationService } from '../../../../proxy/services/doctor-specialization.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TosterService } from 'src/app/shared/services/toster.service';
import { DoctorProfileService } from '../../../../proxy/services/doctor-profile.service';
import { SpecializationService } from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-specialization-dialog',
  templateUrl: './specialization-dialog.component.html',
  styleUrls: ['./specialization-dialog.component.scss'],
})
export class SpecializationDialogComponent implements OnInit {
  @ViewChild('attachments') attachment: any;
  isLoading: boolean = false;
  form!: FormGroup;
  profileInfo: any;
  specializationList: any = [];
  fileList: File[] = [];
  fileNames: any[] = [];
  doctorId: any;
  fileData = new FormData();
  specialityId: any;
  imagePath: any;
  upload: any;
  auth: any;
  url: any;
  profilePic: string = '';
  selectedSpFileName: any;
  private apiUrl = `${environment.apis.default.url}/api`;
  public picUrl = `${environment.apis.default.url}/`;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SpecializationDialogComponent>,
    private tosterService: TosterService,
    private specializationService: SpecializationService,
    private doctorSpecializationService: DoctorSpecializationService,
    private doctorProfileService: DoctorProfileService,
    private normalAuth: AuthService,
    private http: HttpClient,

    @Inject(MAT_DIALOG_DATA) public editData: any | undefined
  ) { }

  ngOnInit(): void {
    this.loadForm();
    let authId = this.normalAuth.authInfo().id;
    this.doctorId = authId;
    if (authId) {
      this.doctorProfileService.get(authId).subscribe((res) => {
        this.form.patchValue(res);
        if (this.editData) {
          this.specializationService
            .getBySpecialityId(this.editData.specialityId)
            .subscribe((res) =>
              this.form
                .get('specializationId')
                ?.patchValue(res.specializationName)
            );
        }
        if (res.specialityId) {
          this.specialityId = res.specialityId;
          this.specializationService
            .getListBySpecialtyId(res.specialityId)
            .subscribe((list) => (this.specializationList = list));
        }
      });
    }
  }

  loadForm() {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      documentName: [this.editData ? this.editData.documentName : '', Validators.required],
      specializationId: [this.editData ? this.editData.specializationId : '', Validators.required],
    });
  }

  saveSpecialization(): void {
    let exSpecialization = this.form.get('specializationId')?.valid;

    if (!this.form.valid && !this.form.touched) {
      this.tosterService.customToast(
        'Please fill all the required fields!',
        'warning'
      );
      return;
    }
    if (!exSpecialization) {
      this.tosterService.customToast(
        'Please select your specialization!',
        'warning'
      );
      return;
    }

    if (this.fileNames.length == 0) {
      this.tosterService.customToast('Please upload your document!', 'warning');
      return;
    }

    let formValue: any = this.form.value;

    const newSpecialization = {
      ...formValue,
      doctorProfileId: this.doctorId,
      specialityId: this.specialityId,
      documentName: this.selectedSpFileName,
    };
    if (!this.editData) {
      this.doctorSpecializationService
        .create(newSpecialization).subscribe((res) => {
          if (res) {

            if (this.fileList.length > 0) {
              for (let item of this.fileList) {
                this.fileData = new FormData();
                this.fileData.append("entityId", this.doctorId.toString());
                this.fileData.append("entityType", "Doctor");
                this.fileData.append("attachmentType", "DoctorSpecialityDoc");
                this.fileData.append("directoryName", "DoctorExperties\\" + this.doctorId.toString());
                //for (let item of this.totalSpFileList) {

                //if (this.totalSpFileList.length > 0) {

                let fileToUpload = item;
                this.fileData.append(item.name, fileToUpload);
                //}
                // save attachment
                this.http.post(`${this.apiUrl}/Common/Documents`, this.fileData).subscribe(
                  (result: any) => {
                    //this.form.reset();
                    //this.spFileData = new FormData();
                    //this.spFileNames = [];
                    this.tosterService.customToast('Documents for Specializations Uploaded Successfully', 'success');
                    //this.cdRef.detectChanges();
                  },
                  (err) => {
                    console.log(err);
                  })

              }
            }
            this.tosterService.customToast(
              'Successfully Saved!',
              'success'
            );

            this.dialogRef.close(true);
            //return
            //this.uploadDocuments();
          }
          else {
            
            this.dialogRef.close(false);
            this.tosterService.customToast(
              'Something went wrong! Please contact your administrator.',
              'error'
            );
          }
        });
    } else {
      let changedProperties: string[] = [];
      let exData: any = this.editData;
      for (const key in newSpecialization) {
        if (
          newSpecialization.hasOwnProperty(key) &&
          newSpecialization[key] !== exData[key]
        ) {
          changedProperties.push(key);
        }
      }
      if (changedProperties.length < 1) {
        this.dialogRef.close(false);
        return;
      } else {
        this.doctorSpecializationService
          .update({ ...newSpecialization, id: this.editData.id }).subscribe((res) => {
            if (res) {
              if (this.fileList.length > 0) {
                for (let item of this.fileList) {
                  this.fileData = new FormData();
                  this.fileData.append("entityId", this.doctorId.toString());
                  this.fileData.append("entityType", "Doctor");
                  this.fileData.append("attachmentType", "DoctorSpecialityDoc");
                  this.fileData.append("directoryName", "DoctorExperties\\" + this.doctorId.toString());
                  //for (let item of this.totalSpFileList) {

                  //if (this.totalSpFileList.length > 0) {

                  let fileToUpload = item;
                  this.fileData.append(item.name, fileToUpload);
                  //}
                  // save attachment
                  this.http.post(`${this.apiUrl}/Common/Documents`, this.fileData).subscribe(
                    (result: any) => {
                      //this.form.reset();
                      //this.spFileData = new FormData();
                      //this.spFileNames = [];
                      this.tosterService.customToast('Documents for Specializations Uploaded Successfully', 'success');
                      //this.cdRef.detectChanges();
                    },
                    (err) => {
                      console.log(err);
                    })
                }
              }
              this.tosterService.customToast(
                'Successfully updated!',
                'success'
              );
              this.dialogRef.close(true);
            } else {
              this.tosterService.customToast(
                'Something went wrong! Please contact your administrator.',
                'error'
              );
              this.dialogRef.close(false);
            }
          });
      }
    }
  }

  uploadDocuments() {
    this.fileData.append('entityId', this.doctorId.toString());
    this.fileData.append('entityType', 'Doctor');
    this.fileData.append('attachmentType', 'DoctorSpecialityDoc');
    this.fileData.append('directoryName','DoctorSpecialityDoc\\' + this.doctorId.toString());
    if (this.fileList.length > 0) {
      for (let item of this.fileList) {
        let fileToUpload = item;
        this.fileData.append(item.name, fileToUpload);
      }
      // save attachment
      this.http
        .post(`${this.apiUrl}/Common/Documents`, this.fileData)
        .subscribe(
          (result: any) => {
            this.tosterService.customToast('Successfully added!', 'success');
            this.dialogRef.close(true);
          },
          (err) => {
            this.dialogRef.close(false);
            console.log(err);
          }
        );
    }
  }

  onFileChanged(event: any) {
    this.fileList = [];
    this.fileNames = [];
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.fileList.push(selectedFile);
      this.fileNames.push(selectedFile.name);
      this.selectedSpFileName = selectedFile.name;
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
      var allowedFiles = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/pdf',
      ];
      const files: File[] = event.target.files;
      this.fileList = Array.from(files);
      for (let i = 0; i < count; i++) {
        if (files[i].size > 5242880) {
          this.fileNames.splice(i, 1);
          this.fileList.splice(i, 1);

          this.tosterService.customToast('Maximum 5MB Accepted', 'warning');
          //this.toastr.warning('Maximum 5MB Accepted.', 'Warning');
        }
        if (!(allowedFiles.indexOf(files[i].type.toLowerCase()) >= 0)) {
          this.fileNames.splice(i, 1);
          this.fileList.splice(i, 1);
          this.tosterService.customToast(
            'Only jpeg & jpg are Accepted.',
            'warning'
          );
        }
      }
    }
  }
}
