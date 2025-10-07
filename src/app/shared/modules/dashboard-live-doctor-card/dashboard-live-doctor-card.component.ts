import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { LiveConsultBookingDialogComponent } from 'src/app/features-modules/public/landing-page/components/live-doctors/live-consult-booking-dialog/live-consult-booking-dialog.component';
import {
  DoctorScheduleService,
  FinancialSetupService,
} from 'src/app/proxy/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SubSink } from 'subsink';
import { TosterService } from './../../services/toster.service';

@Component({
  selector: 'app-dashboard-live-doctor-card',

  templateUrl: './dashboard-live-doctor-card.component.html',
  styleUrl: './dashboard-live-doctor-card.component.scss',
})
export class DashboardLiveDoctorCardComponent {
  @Input() details: any;
  isLoading: boolean = false;
  isAuthUser: any;
  userType: string = '';
  subs = new SubSink();
  constructor(
    private NormalAuth: AuthService,
    private DoctorScheduleService: DoctorScheduleService,
    private FinancialSetupService: FinancialSetupService,
    public dialog: MatDialog,
    private TosterService: TosterService
  ) {
    this.isAuthUser = this.NormalAuth.authInfo()?.id;

    this.userType = this.NormalAuth.authInfo()?.userType;
  }
  onClickConsultNow(data: any) {
    this.openDialog(data);
  }
  // openDialog(data: any): void {
  //   if (data.id) {
  //     this.isLoading = true;
  //     let a: any;

  //     const detailsSchedule$ =
  //       this.DoctorScheduleService.getDetailsScheduleListByDoctorId(data.id);
  //     const financialSetup$ =
  //       this.FinancialSetupService.getListByProviderIdandType(
  //         1,
  //         data.id,
  //         this.userType
  //       );
  //     console.log(financialSetup$);
  //     forkJoin([detailsSchedule$, financialSetup$]).subscribe(
  //       ([detailsScheduleRes, financialSetupRes]) => {
  //         if (detailsScheduleRes?.length > 0 && data) {
  //           this.isLoading = false;
  //           const dialogRef = this.dialog.open(
  //             LiveConsultBookingDialogComponent,
  //             {
  //               maxWidth: 600,
  //               minWidth: 320,
  //               data: {
  //                 doctorDetails: data,
  //                 doctorScheduleInfo: detailsScheduleRes,
  //                 isAuthUser: true,
  //                 userAccess: true,
  //                 serviceFeeList: financialSetupRes, //, // Add the serviceFeeList to the data object
  //               },
  //             }
  //           );
  //         } else {
  //           this.isLoading = false;
  //           this.TosterService.customToast(
  //             `No Details/Schedule found`,
  //             'warning'
  //           );
  //         }
  //       }
  //     );
  //   } else {
  //     this.isLoading = false;
  //     this.TosterService.customToast(`No Details/Schedule found`, 'warning');
  //   }
  // }
  openDialog(data: any): void {
    this.isLoading = true;

    if (data.id) {
      let a: any;

      const financialSetup$ =
        this.FinancialSetupService.getListByProviderIdandType(
          1,
          data.id,
          this.userType
        );

      forkJoin([financialSetup$]).subscribe({
        next: ([financialSetupRes]) => {
          if (financialSetupRes?.length > 0 && data) {
            this.isLoading = false;
            this.dialog.open(LiveConsultBookingDialogComponent, {
              maxWidth: 600,
              minWidth: 320,
              data: {
                doctorDetails: data,
                doctorScheduleInfo: [],
                isAuthUser: this.isAuthUser ? true : false,
                userAccess: this.userType == 'doctor' ? false : true,
                isAgentSpecific: true,
                serviceFeeList: financialSetupRes, // Add the serviceFeeList to the data object
              },
            });
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.TosterService.customToast(`Something went wrong`, 'error');
        },
      });
    } else {
      this.isLoading = false;
      this.TosterService.customToast(`No Details/Schedule found`, 'warning');
    }
  }
}
