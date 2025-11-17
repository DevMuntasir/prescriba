import { LoaderService } from './../../../shared/services/loader.service';
import {
  DoctorProfileService,
  DocumentsAttachmentService,
} from 'src/app/api/services';

import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DoctorProfileInputDto } from 'src/app/api/input-dto';
import { CommonService } from 'src/app/shared/services/common.service';
import { DoctorTitle } from 'src/app/api/enums';
import { ListItem } from 'src/app/shared/model/common-model';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { SubSink } from 'subsink';
import { TosterService } from 'src/app/shared/services/toster.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PictureDialogComponent } from '../../../shared/modules/picture-dialog/picture-dialog.component';
import { UserinfoStateService } from 'src/app/shared/services/states/userinfo-state.service';
import { AvaterServiceService } from 'src/app/shared/services/avater-service.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {
  @ViewChild('attachments') attachment: any;
  @Output() getProfileInfo = new EventEmitter();

  animationDirection = 'right';
  selectedIndex: any;
  userId: any;
  isLoading: boolean = false;
  profileInfo: any;
  doctorTitleList: ListItem[] = [];
  title: any;
  activeTab: string = '';
  subs = new SubSink();
  fileList: File[] = [];
  fileNames: any[] = [];
  fileData = new FormData();
  imagePath: any;
  upload: any;
  auth: any;
  url: any;
  profilePic: string = '';

  public picUrl = `${environment.apis.default.url}/`;
  doctorId: any;

  constructor(
    private _fb: FormBuilder,
    private doctorProfileService: DoctorProfileService,
    private _router: Router,
    private TosterService: TosterService,
    private normalAuth: AuthService,
    public dialog: MatDialog,
    private UserinfoStateService: UserinfoStateService,
    private profilePicService: AvaterServiceService
  ) {}

  ngOnInit(): void {
    //this.auth = localStorage.getItem("auth");
    let user = this.normalAuth.authInfo();
    this.doctorId = user.id;
    if (user.id) {
      this.UserinfoStateService.getProfileInfo(user.id, user.userType);
    }
    this.doctorTitleList = CommonService.getEnumList(DoctorTitle);
    const currentURL = this._router.url;
    this.getLastPathSegment(currentURL);

    this.UserinfoStateService.getData().subscribe(
      (userInfo) => (this.profileInfo = userInfo)
    );
    this.getProfilePic();
  }

  // getProfileInfo(id: any): void {
  //   if (id) {
  //     this.LoaderService.sendLoaderState(true);
  //     this.doctorProfileService.get(id).subscribe((res) => {
  //       this.profileInfo = res;
  //       this.LoaderService.sendLoaderState(false);
  //     });
  //   }
  // }
  // this function need to optimize in future
  getTitle(title: string) {
    let doctortitle = this.doctorTitleList.find((e) => e.id == title);
    return doctortitle?.name;
  }

  firstFormGroup = this._fb.group({
    firstCtrl: ['', Validators.required],
  });

  secondFormGroup = this._fb.group({
    secondCtrl: ['', Validators.required],
  });

  isLinear = false;

  handleFormData(formData: any) {
    const updatedProfile: DoctorProfileInputDto = {
      ...formData,
    };
    let changedProperties: string[] = [];

    for (const key in formData) {
      if (
        formData.hasOwnProperty(key) &&
        formData[key] !== this.profileInfo[key]
      ) {
        changedProperties.push(key);
      }
    }
    if (changedProperties.length === 0) {
      this.TosterService.customToast('Nothing has changed', 'warning');
      this.isLoading = false;
    } else {
      this.isLoading = true;
      this.doctorProfileService.updateDoctorProfile(updatedProfile).subscribe(
        (res) => {
          // res condition may apply, need to update in the future
          this.isLoading = false;
          let successMessage = '';

          if (changedProperties.length > 0) {
            if (changedProperties.length > 1) {
              const lastProperty = changedProperties.pop();
              const joinedProperties = changedProperties.join(', ');
              successMessage = `${joinedProperties} and ${lastProperty} Successfully Updated!`;
            } else {
              successMessage = `${changedProperties[0]} Successfully Updated! `;
            }
          }
          this.TosterService.customToast(successMessage, 'success');
          this.UserinfoStateService.getProfileInfo(this.doctorId, 'doctor');
          this.getProfilePic();
        },
        (error) => {
          this.isLoading = false;
          this.TosterService.customToast(error.message, 'error');
        }
      );
    }
    //if (this.fileList.length > 0) {
    //  this.fileData.append("entityId", this.profileInfo.id.toString());
    //  this.fileData.append("entityType", "Doctor");
    //  this.fileData.append("attachmentType", "ProfilePicture");
    //  this.fileData.append("directoryName", "DoctorProfilePicture\\" + this.profileInfo.id.toString());
    //  if (this.fileList.length > 0) {
    //    for (let item of this.fileList) {
    //      let fileToUpload = item;
    //      this.fileData.append(item.name, fileToUpload);
    //    }
    //    // save attachment
    //    this.http.post(`${this.apiUrl}/Common/Documents`, this.fileData).subscribe(
    //      (result: any) => {
    //        //this.form.reset();
    //        //this.fileData = new FormData();
    //        //this.fileNames = this.fileNames;
    //        this.TosterService.customToast('Picture Changed Successfully', 'success');

    //      },
    //      (err) => {
    //        console.log(err);
    //      });
    //    this.cdRef.detectChanges();
    //  }
    //}
  }

  getLastPathSegment(url: string): void {
    const urlParts = url.split('/');
    let pathName = urlParts[urlParts.length - 1];

    if (pathName == 'basic-info') {
      this.activeTab = '0';
    }
    if (pathName == 'education') {
      this.activeTab = '1';
    }
    if (pathName == 'specialization') {
      this.activeTab = '2';
    }
    if (pathName == 'documents') {
      this.activeTab = '3';
    }
  }

  onchangeStep(e: any) {
    if (e.selectedIndex == 0) {
      this._router.navigate(['doctor/profile-settings/basic-info']);
    }
    if (e.selectedIndex == 1) {
      this._router.navigate(['doctor/profile-settings/education']);
    }
    if (e.selectedIndex == 2) {
      this._router.navigate(['doctor/profile-settings/specialization']);
    }
    if (e.selectedIndex == 3) {
      this._router.navigate(['doctor/profile-settings/documents']);
    }
  }

  getProfilePic() {
    this.profilePicService
      .getProfilePic('Doctor', this.doctorId, 'ProfilePicture')
      .then(({ profilePic, picUrl }) => {
        this.profilePic = profilePic;
        this.url = picUrl + this.profilePic;
        this.isLoading = false;
      })
      .catch((error) => {
        this.TosterService.customToast('Error getting profile picture:', error);
        this.isLoading = false;
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PictureDialogComponent, {
      width: '30vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getProfilePic();
      }
    });
  }
}
