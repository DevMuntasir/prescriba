import {
  FullscreenOverlayContainer,
  OverlayContainer,
} from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, of, Subscription, filter } from 'rxjs';
import { AuthInterceptor } from 'src/app/helper/auth.interceptor';
import { AppointmentDto } from 'src/app/proxy/dto-models';
import { DoctorProfileService } from 'src/app/proxy/services';
import { environment } from 'src/environments/environment';
import { AppointmentService } from './../../../proxy/services/appointment.service';
import { DoctorChamberService } from './../../../proxy/services/doctor-chamber.service';
import { DoctorScheduleService } from './../../../proxy/services/doctor-schedule.service';
import { DocumentsAttachmentService } from './../../../proxy/services/documents-attachment.service';
import { AuthService } from './../../../shared/services/auth.service';
import { BottomNavComponent } from './components/others/bottom-nav/bottom-nav.component';
import { DoctorInfoComponent } from './components/others/doctor-info/doctor-info.component';
import { MedicationComponent } from './components/others/medication/medication.component';
import { PatientInfoComponent } from './components/others/patient-info/patient-info.component';
import { PrescriptionSkeltonComponent } from './components/others/prescription-skelton/prescription-skelton.component';
import { SectionComponent } from './components/others/section/section.component';
import { TopbarComponent } from './components/others/topbar/topbar.component';
import { DynamicModalComponent } from './components/shared/dynamic-modal/dynamic-modal.component';
import { ModalIconComponent } from './components/shared/dynamic-modal/icons/modal-icon/modal-icon.component';
import { ChiefComplaintsService } from './services/chief-complaints.service';
import { PrescriptionService } from './services/prescription.service';
// TODO
interface ExtendedAppointmentDto extends AppointmentDto {
  bloodGroup?: string;
}
@Component({
  selector: 'app-prescribe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatientInfoComponent,
    DoctorInfoComponent,
    ModalIconComponent,
    MatDatepickerModule,

    BottomNavComponent,
    MatFormFieldModule,
    MatInputModule,
    MedicationComponent,
    TopbarComponent,
    SectionComponent,
    PrescriptionSkeltonComponent,
  ],
  providers: [
    provideNativeDateAdapter(),
    ChiefComplaintsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
  ],

  templateUrl: './prescribe.component.html',
  styleUrls: ['./prescribe.component.scss'],
})
export class PrescribeComponent implements OnInit, OnDestroy {
  appointmentInfo: AppointmentDto = {} as AppointmentDto;
  prescribeForm!: FormGroup;
  private formSubscription!: Subscription;
  @ViewChild('fullScreenElement') fullScreenElement!: ElementRef;
  isLoading: boolean = false;
  isFullScreen: boolean = false;
  followupDate: any;
  docFile: string = '';
  docFileUrl: any[] = [];
  public picUrl = `${environment.apis.default.url}/`;
  uploadImage: {
    isUploadImage: boolean;
    image: string;
  } = {
    isUploadImage: false,
    image: '',
  };
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private DoctorProfileService: DoctorProfileService,
    private DoctorChamberService: DoctorChamberService,
    private DoctorScheduleService: DoctorScheduleService,
    private AppointmentService: AppointmentService,
    private ActivatedRoute: ActivatedRoute,
    private AuthService: AuthService,
    private DocumentsAttachmentService: DocumentsAttachmentService
  ) {}

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.followupDate = event.value;
    this.prescriptionService.setFollowUp(
      new Date(event.value as Date).toISOString()
    );
  }
  enterFullScreen() {
    this.isFullScreen = true;
    const elem = this.fullScreenElement.nativeElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.prescriptionService.resetForm();
    this.prescribeForm = this.prescriptionService.prescribeForm();
    const doctorProfileId = this.AuthService.authInfo().id ?? null;
    this.ActivatedRoute.queryParams.subscribe((params) => {
      if (params['aptId']) {
        this.prescriptionService.setAppointmentId(Number(params['aptId']));
        this.loadAppointmentData(Number(params['aptId']), doctorProfileId);
      } else {
        this.prescriptionService.setPreHand(true);
        this.loadAppointmentDataForPrehandByDrId(doctorProfileId);
      }
    });
    this.prescribeForm.get('uploadImage')?.valueChanges.subscribe((res) =>
      res !== '' || res !== undefined
        ? (this.uploadImage = {
            image: res,
            isUploadImage: true,
          })
        : (this.uploadImage = {
            image: res,
            isUploadImage: false,
          })
    );
  }

  getDocuments(id: any) {
    this.DocumentsAttachmentService.getAttachmentInfoByEntityTypeAndEntityIdAndAttachmentType(
      'Doctor',
      id,
      'DoctorSign'
    ).pipe(
      map((at) =>
        at.map((e) => {
          let prePaths: string = '';
          var re = /wwwroot/gi;
          prePaths = e.path ? e.path : '';
          this.docFile = prePaths.replace(re, '');
          return this.picUrl + this.docFile;
        })
      )
    );
  }

  loadAppointmentDataForPrehandByDrId(doctorProfileId: number) {
    this.isLoading = true;

    forkJoin({
      doctorDetails: this.DoctorProfileService.getDoctorByProfileId(
        doctorProfileId
      ).pipe(
        map((doctorDetails) => ({
          ...doctorDetails,
          degrees: doctorDetails?.degrees?.map(
            ({
              degreeName,
              instituteName,
              instituteCity,
              instituteCountry,
            }) => ({
              degreeName,
              instituteName,
              instituteCity,
              instituteCountry,
            })
          ),
        }))
      ),

      signature:
        this.DocumentsAttachmentService.getAttachmentInfoByEntityTypeAndEntityIdAndAttachmentType(
          'Doctor',
          doctorProfileId,
          'DoctorSign'
        ).pipe(
          map((at) =>
            at.map((e) => {
              let prePaths: string = '';
              var re = /wwwroot/gi;
              prePaths = e.path ? e.path : '';
              this.docFile = prePaths.replace(re, '');
              return this.picUrl + this.docFile;
            })
          )
        ),
    }).subscribe(({ doctorDetails, signature }) => {
      this.prescriptionService.setDoctorInfo({
        doctorName:
          doctorDetails.doctorTitleName + ' ' + doctorDetails.fullName,
        doctorCode: doctorDetails.doctorCode || null,
        doctorProfileId,
        degree: doctorDetails.degrees,
        qualification: doctorDetails.qualifications || null,
        areaOfExperties: doctorDetails.areaOfExperties || null,
        bmdc: doctorDetails.bmdcRegNo || null,
        chamber: [],
        schedule: [],
        signature: signature[0] || '',
      });

      this.isLoading = false;
    });
  }

  loadAppointmentData(appointmentId: number, doctorProfileId: number): void {
    this.isLoading = true;

    this.AppointmentService.get(appointmentId).subscribe((appointmentInfo) => {
      this.appointmentInfo = appointmentInfo;

      const {
        patientName,
        doctorScheduleId,
        doctorChamberId,
        appointmentCode,
      } = this.appointmentInfo;
      this.prescriptionService.setAppointmentCode(appointmentCode);
      if (doctorProfileId) {
        forkJoin({
          chamber: doctorChamberId
            ? this.DoctorChamberService.get(doctorChamberId).pipe(
                map((res) => [res])
              )
            : of([]),

          schedule: doctorScheduleId
            ? this.DoctorScheduleService.get(doctorScheduleId).pipe(
                map((schedule) => {
                  const sessions =
                    schedule?.doctorScheduleDaySession
                      ?.filter(
                        (day) =>
                          day.scheduleDayofWeek && day.startTime && day.endTime
                      )
                      ?.map((day) => ({
                        day: day.scheduleDayofWeek!,
                        startTime: day.startTime!,
                        endTime: day.endTime || day.startTime,
                      })) || [];

                  const groupedByDay: {
                    [key: string]: { startTime: string; endTime: string }[];
                  } = {};

                  sessions.forEach(({ day, startTime, endTime }) => {
                    if (!groupedByDay[day]) {
                      groupedByDay[day] = [];
                    }

                    if (
                      !groupedByDay[day].some(
                        (item) =>
                          item.startTime === startTime &&
                          item.endTime === endTime
                      )
                    ) {
                      groupedByDay[day].push({
                        startTime,
                        endTime: endTime || '',
                      });
                    }
                  });

                  const groupedSchedule = Object.entries(groupedByDay).map(
                    ([day, times]) => {
                      const sortedTimes = times.sort((a, b) => {
                        const t1 = new Date(
                          `1970-01-01T${this.convertTo24(a.startTime)}`
                        );
                        const t2 = new Date(
                          `1970-01-01T${this.convertTo24(b.startTime)}`
                        );
                        return t1.getTime() - t2.getTime();
                      });

                      return {
                        day,
                        startTime: sortedTimes[0].startTime,
                        endTime: sortedTimes[sortedTimes.length - 1].endTime,
                      };
                    }
                  );

                  const optimizedSchedule = [];
                  let currentRange = {
                    start: groupedSchedule[0]?.day,
                    end: groupedSchedule[0]?.day,
                    startTime: groupedSchedule[0]?.startTime,
                    endTime: groupedSchedule[0]?.endTime,
                  };

                  for (let i = 1; i < groupedSchedule.length; i++) {
                    const current = groupedSchedule[i];

                    const isConsecutive = this.isConsecutiveDays(
                      currentRange.end,
                      current.day
                    );
                    const isSameTime =
                      current.startTime === currentRange.startTime &&
                      current.endTime === currentRange.endTime;

                    if (isConsecutive && isSameTime) {
                      currentRange.end = current.day;
                    } else {
                      if (currentRange.start === currentRange.end) {
                        optimizedSchedule.push({
                          start: currentRange.start,
                          end: currentRange.start,
                          startTime: currentRange.startTime,
                          endTime: currentRange.endTime,
                        });
                      } else {
                        optimizedSchedule.push({ ...currentRange });
                      }
                      currentRange = {
                        start: current.day,
                        end: current.day,
                        startTime: current.startTime,
                        endTime: current.endTime,
                      };
                    }
                  }

                  if (currentRange.start === currentRange.end) {
                    optimizedSchedule.push({
                      start: currentRange.start,
                      end: currentRange.start,
                      startTime: currentRange.startTime,
                      endTime: currentRange.endTime,
                    });
                  } else {
                    optimizedSchedule.push({ ...currentRange });
                  }

                  return optimizedSchedule;
                })
              )
            : of([]),

          signature:
            this.DocumentsAttachmentService.getAttachmentInfoByEntityTypeAndEntityIdAndAttachmentType(
              'Doctor',
              doctorProfileId,
              'DoctorSign'
            ).pipe(
              map((at) =>
                at.map((e) => {
                  let prePaths: string = '';
                  var re = /wwwroot/gi;
                  prePaths = e.path ? e.path : '';
                  this.docFile = prePaths.replace(re, '');
                  return this.picUrl + this.docFile;
                })
              )
            ),
          doctorDetails: this.DoctorProfileService.getDoctorByProfileId(
            doctorProfileId
          ).pipe(
            map((doctorDetails) => ({
              ...doctorDetails,
              degrees: doctorDetails?.degrees
                ?.map(
                  ({
                    degreeName,
                    instituteName,
                    instituteCity,
                    instituteCountry,
                    isPrescriptionShow,
                  }) => ({
                    degreeName,
                    instituteName,
                    instituteCity,
                    instituteCountry,
                    isPrescriptionShow,
                  })
                )
                .filter((d) => d.isPrescriptionShow == true),
            }))
          ),
        }).subscribe(({ schedule, signature, doctorDetails, chamber }) => {
          // this.doctorDetails = doctorDetails;
          this.prescriptionService.setDoctorInfo({
            doctorName:
              doctorDetails.doctorTitleName + ' ' + doctorDetails.fullName,
            doctorCode: doctorDetails.doctorCode || null,
            doctorProfileId,
            degree: doctorDetails.degrees,
            qualification: doctorDetails.qualifications || null,
            areaOfExperties: doctorDetails.areaOfExperties || null,
            bmdc: doctorDetails.bmdcRegNo || null,
            chamber,
            schedule,
            signature: signature[0] || '',
          });
          this.isLoading = false;
        });
      } else {
        console.log('Doctor profile ID not found');
      }

      if (patientName) {
        this.prescriptionService.setPatientInfo({
          patientName,
          patientAge: this.appointmentInfo.patientAge
            ? String(this.appointmentInfo.patientAge)
            : '',
          patientCode: this.appointmentInfo.patientCode || null,
          patientProfileId: this.appointmentInfo.patientProfileId || null,
          patientPhoneNo: this.appointmentInfo.patientMobileNo || null,
          patientBloodGroup: (this.appointmentInfo.bloodGroup as string) ?? '',
        });
      }
    });
  }
  convertTo24(time: string): string {
    const [t, modifier] = time.split(' ');
    let [hours, minutes] = t.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  isConsecutiveDays(prevDay: string, currentDay: string): boolean {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const prevIndex = daysOfWeek.indexOf(prevDay);
    const currentIndex = daysOfWeek.indexOf(currentDay);

    return currentIndex === (prevIndex + 1) % 7;
  }
  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
  get complaints() {
    return this.prescribeForm.get('chiefComplaints')?.value;
  }
  openDynamicDialog(type: string, content: any) {
    const dialogRef = this.dialog.open(DynamicModalComponent, {
      maxWidth: '850px',
      maxHeight: '95vh',
      data: { type, content, form: this.prescribeForm },
      // disableClose: true,
      panelClass: 'custom-modal',
      autoFocus: false,
    });
  }
  get complaint() {
    return this.prescribeForm.get('chiefComplaints')?.value;
  }
  get historys() {
    return this.prescribeForm.get('history')?.value;
  }
  get diagnosis() {
    return this.prescribeForm.get('diagnosis')?.value;
  }
  get tests() {
    return this.prescribeForm.get('test')?.value;
  }
  get advice() {
    return this.prescribeForm.get('advice')?.value;
  }
  get medications() {
    return this.prescribeForm.get('medications')?.value;
  }
  get exam() {
    return this.prescribeForm.get('examination')?.value;
  }
  get patient() {
    return this.prescribeForm.get('patient') as FormGroup;
  }
  get doctor() {
    return this.prescribeForm.get('doctor')?.value;
  }
  get isPreHand() {
    return this.prescribeForm.get('isPreHand')?.value;
  }
  get isHeader() {
    return this.prescribeForm.get('isHeader')?.value;
  }
  get isTemplate() {
    return this.prescribeForm.get('isTemplate')?.value;
  }
  get appointmentCode() {
    return this.prescribeForm.get('appointmentCode')?.value;
  }

  openComplaintDialog() {
    this.openDynamicDialog('complaint', this.complaint);
  }
  openHistoryDialog() {
    this.openDynamicDialog('history', this.historys);
  }
  openTestDialog() {
    this.openDynamicDialog('test', this.tests);
  }
  openDiagnosisDialog() {
    this.openDynamicDialog('diagnosis', this.diagnosis);
  }
  openExaminationDialog() {
    this.openDynamicDialog(
      'examination',
      this.prescribeForm.get('examination')!.value
    );
  }
  openMedicineDialog() {
    this.openDynamicDialog('medicine', this.medications);
  }
  openAdviceDialog() {
    this.openDynamicDialog('advice', this.prescribeForm.get('advice')!.value);
  }
  openFollowUpDialog() {
    this.openDynamicDialog(
      'followUp',
      this.prescribeForm.get('followUp')!.value
    );
  }
  onClickSelectChamber() {
    this.openDynamicDialog(
      'select-chamber',
      this.prescribeForm.get('doctor')!.value.chamber
    );
  }
  // todo remove
  updatePrescription(type: string, data: any) {
    switch (type) {
      case 'complaint':
        this.setFormArrayValue('chiefComplaints', data);
        break;
      // other cases...
    }
  }

  private setFormArrayValue(arrayName: string, data: any[]) {
    const formArray = this.prescribeForm.get(arrayName) as FormArray;
    formArray.clear();
    data.forEach((item) => {
      formArray.push(this.fb.group(item));
    });
  }

  getDots(schedule: string): number[] {
    const [morning, noon, night] = schedule.split('-').map(Number);
    return Array(morning + noon + night).fill(0);
  }
}
