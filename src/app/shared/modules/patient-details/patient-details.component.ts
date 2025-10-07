import { PrescriptionMasterService } from './../../../proxy/services/prescription-master.service';
import { PatientProfileService } from 'src/app/proxy/services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrescriptionMasterDto } from 'src/app/proxy/dto-models';
import { AuthService } from '../../services/auth.service';
import {
  PrescriptionPdf,
  PrescriptionPdfResponse,
  PrescriptionService,
} from '../../services/prescription/prescription.service';
@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit {
  patientProfileInfo: any;
  prescriptionListDetails!: PrescriptionMasterDto[];
  newPrescriptionDetails: PrescriptionPdf[] = {} as PrescriptionPdf[];
  userInfo: any;

  constructor(
    private route: ActivatedRoute,
    private PatientProfileService: PatientProfileService,
    private PrescriptionMasterService: PrescriptionMasterService,
    private NormalAuth: AuthService,
    private PrescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    let user = this.NormalAuth.authInfo();
    this.userInfo = user;

    const { patientProfileId } = this.route.snapshot.params;

    if (this.userInfo.userType === 'doctor') {
      if (patientProfileId && user.id) {
        this.PatientProfileService.get(patientProfileId).subscribe((res) => {
          this.patientProfileInfo = res;
        });
        this.PrescriptionMasterService.getPrescriptionMasterListByPatientId(
          patientProfileId
        ).subscribe((res) => {
          console.log(res);

          this.prescriptionListDetails = res;
        });

        this.PrescriptionService.getPrescriptionByPatientId(
          patientProfileId
        ).subscribe({
          next: (res) => {
            this.newPrescriptionDetails = res.results;
          },
        });
      }
    }

    if (
      this.userInfo.userType === 'patient' ||
      this.userInfo.userType === 'agent'
    ) {
      this.PatientProfileService.get(patientProfileId).subscribe((res) => {
        this.patientProfileInfo = res;
      });
      this.PrescriptionService.getPrescriptionByPatientId(
        patientProfileId
      ).subscribe({
        next: (res) => {
          this.newPrescriptionDetails = res.results;
        },
      });
      this.PrescriptionMasterService.getPrescriptionMasterListByPatientId(
        patientProfileId
      ).subscribe((res) => {
        this.prescriptionListDetails = res;
        console.log(res);
      });
    }
  }
}
