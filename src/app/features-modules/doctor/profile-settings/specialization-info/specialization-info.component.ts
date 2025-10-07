import { TosterService } from 'src/app/shared/services/toster.service';
import { DoctorProfileService } from '../../../../proxy/services/doctor-profile.service';
import { DoctorSpecializationDto } from '../../../../proxy/dto-models/models';
import { Component, OnInit } from '@angular/core';
import {
  DoctorSpecializationService,
  DocumentsAttachmentService,
  SpecialityService,
  SpecializationService,
} from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SubSink } from 'subsink';
import { MatDialog } from '@angular/material/dialog';
import { SpecializationDialogComponent } from '../specialization-dialog/specialization-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-specialization-info',
  templateUrl: './specialization-info.component.html',
  styleUrls: ['./specialization-info.component.scss'],
})
export class SpecializationInfoComponent implements OnInit {
  allSpecializations: DoctorSpecializationDto[] = [];
  specialityName: any = '';
  specializationName: any = '';
  specialityId: any = '';
  doctorId: any;
  subs = new SubSink();
  expertise: string = '';
  constructor(
    public dialog: MatDialog,
    private doctorSpecializationService: DoctorSpecializationService,
    private doctorSpeciality: SpecialityService,
    private specializationService: SpecializationService,
    private normalAuth: AuthService,
    private doctorProfileService: DoctorProfileService,
    private doctorDocService: DocumentsAttachmentService,
    private TosterService: TosterService
  ) {}

  ngOnInit(): void {
    let authId = this.normalAuth.authInfo().id;

    if (authId) {
      this.doctorId = authId;
      this.getDoctorExpertise();
      this.doctorSpeciality.get(this.specialityId).subscribe((res) => {
        this.specialityName = res.specialityName;
      });
      this.combineObservables(this.doctorId);
    }
  }

  combineObservables(id: any): void {
    const doctorSpecialization$ =
      this.doctorSpecializationService.getDoctorSpecializationListByDoctorId(
        id
      );
    const profilePic$ =
      this.doctorDocService.getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType(
        'Doctor',
        this.doctorId,
        'DoctorSpecialityDoc'
      );

    forkJoin([doctorSpecialization$, profilePic$]).subscribe(
      ([specializations]) => {
        this.allSpecializations = specializations;
        console.log(specializations);
      }
    );
  }

  getDoctorSpecializationList(docId: any): void {
    this.doctorSpecializationService
      .getDoctorSpecializationListByDoctorId(docId)
      .subscribe((res) => {
        console.log(res);

        this.allSpecializations = res;
      });
  }

  //   getProfilePic() {
  //  this.doctorDocService
  //     .getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType(
  //       'Doctor',
  //       this.doctorId,
  //       'ProfilePicture'
  //       )
  //       .subscribe((at) => {
  //           if (at) {
  //               let prePaths: string = '';
  //               var re = /wwwroot/gi;
  //               prePaths = at.path ? at.path : '';
  //               this.profilePic = prePaths.replace(re, '');
  //               this.url = this.picUrl + this.profilePic;
  //             }
  //           });
  //         }

  getSpecializations(id: any) {
    return this.specializationService.getBySpecialityId(id).subscribe((res) => {
      this.specializationName = res.specializationName;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SpecializationDialogComponent, {
      maxHeight: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        //this.getDoctorSpecializationList(this.doctorId);
        this.getDoctorSpecializationList(this.doctorId);
      }
    });
  }
  handleSpecializationEdit(row: any) {
    this.dialog
      .open(SpecializationDialogComponent, {
        data: row,
        maxHeight: '450px',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == true) {
          this.getDoctorSpecializationList(this.doctorId);
        }
      });
  }
  addExpertise() {
    console.log(this.doctorId);

    if (this.expertise !== '') {
      this.doctorProfileService
        .updateExpertiseByIdAndExpertise(this.doctorId, this.expertise)
        .subscribe({
          next: (res) => {
            this.TosterService.customToast(
              'Successfully update your expertise!',
              'success'
            );
          },
          error: () => {
            this.TosterService.customToast('Something went wrong!', 'error');
          },
        });
    } else {
      this.TosterService.customToast('Please add expertise!', 'warning');
    }
  }
  getDoctorExpertise() {
    this.doctorProfileService
      .getDoctorByProfileId(this.doctorId)
      .subscribe((res) => {
        this.expertise = res.expertise ? res.expertise : '';
      });
  }
  getNID() {
    this.doctorDocService
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
          // this.profileNid = prePaths.replace(re, '');
          // this.profNidUrl = this.picUrl + this.profileNid;
        }
        console.log(at);
      });
    // this.nidUploadBtn = false;
  }
}
