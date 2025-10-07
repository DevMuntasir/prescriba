import { countries } from './../../../shared/utils/country';
import { TosterService } from './../../../shared/services/toster.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DegreeDto,
  DoctorDegreeDto,
  DoctorProfileDto,
  DoctorSpecializationDto,
  PatientProfileDto,
  SpecializationDto,
  UserSignUpResultDto,
} from 'src/app/proxy/dto-models';
import { Gender, MaritalStatus, DoctorTitle } from 'src/app/proxy/enums';
import {
  DoctorDegreeInputDto,
  DoctorProfileInputDto,
  DoctorSpecializationInputDto,
} from 'src/app/proxy/input-dto';
import {
  DoctorProfileService,
  OtpService,
  UserAccountsService,
  SpecialityService,
  SpecializationService,
  DegreeService,
  DocumentsAttachmentService,
  PatientProfileService,
} from 'src/app/proxy/services';
import { ListItem } from 'src/app/shared/model/common-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { SubSink } from 'subsink';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  CustomValidators,
  customNameValidator,
  yearValidator,
} from 'src/app/shared/utils/auth-helper';
import { Subject } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
function customPassingYearValidator(control: any) {
  const value = control.value;
  const currentYear = new Date().getFullYear();
  if (!/^[1-9]\d{3}$/.test(value) || Number(value) > currentYear) {
    return { invalidPassingYear: true };
  }
  return null;
}

@Component({
  selector: 'app-signup-component',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [DatePipe],
})
export class SignupComponent implements OnInit {
  @ViewChild('attachments') attachment: any;
  @ViewChild('idAttachments') idAttachment: any;
  @ViewChild('signAttachments') signAttachments: any;
  @ViewChild('spAttachments') spAttachment: any;
  //subs = new SubSink();
  fileList: File[] = [];
  fileNames: any[] = [];

  idFileList: File[] = [];
  idFileNames: any[] = [];

  signFileList: File[] = [];
  signFileNames: any[] = [];

  spFileList: File[] = [];
  spFileNames: any[] = [];
  selectedSpFileName: any;
  totalSpFileList: File[] = [];

  fileData = new FormData();
  idFileData = new FormData();
  signFileData = new FormData();
  spFileData = new FormData();
  imagePath: any;
  upload: any;
  auth: any;

  profPicUrl: any;
  profNidUrl: any;
  profSignUrl: any;

  profilePic: string = '';
  profileNid: string = '';
  profileSign: string = '';
  spFileCount: number = 0;
  private apiUrl = `${environment.apis.default.url}/api`;
  public picUrl = `${environment.apis.default.url}/`;

  formGroup!: FormGroup;
  userInfoForm!: FormGroup;
  docId: any;
  mobile: string = '';
  userType: string = '';
  otp?: number;
  errMsg: string = '';
  isValid = true;
  showError = true;
  subs = new SubSink();
  isQueryParam: boolean = false;
  isLoading = false;
  selectedUserType: string = '';
  otpModal: boolean = false;
  userInfoModal: boolean = false;
  doctorProfileDto: any;
  forStepUpdateDto: DoctorProfileInputDto = {} as DoctorProfileInputDto;
  newCreatedProfileDto: DoctorProfileInputDto = {} as DoctorProfileInputDto;
  completeDegreeSpecilizationInfoModal: boolean = false;
  completeDocumentUpload: boolean = false;
  completeUploadDocumen: boolean = false;
  receivedFormData!: FormGroup;
  titleList: ListItem[] = [];

  genderList: ListItem[] = [];
  maritalOptions: ListItem[] = [];
  specialties: any = [];
  profileStep: any;

  doctorName: any;

  //education & specialization

  degreeList: DegreeDto[] = [];
  specializationList: SpecializationDto[] = [];
  doctorDegreeList: DoctorDegreeDto[] = [];
  doctorDegrees: DoctorDegreeDto[] = [];
  doctorDegreeInputs: DoctorDegreeInputDto[] = [];
  doctorSpecializationList: DoctorSpecializationDto[] = [];
  doctorSpecializations: any[] = [];
  doctorSpecializationInputs: DoctorSpecializationInputDto[] = [];
  doctorList: DoctorProfileDto[] = [];
  degreeName: any;
  degreeMendatoryMassage: any;
  spMendatoryMassage: any;
  documentMassage: any;
  specializationName: any;
  specialityName: any;

  detectChnage: boolean = false;
  durationList: any = [
    { id: 1, name: '1 year' },
    { id: 2, name: '2 year' },
    { id: 3, name: '3 year' },
    { id: 4, name: '4 year' },
    { id: 5, name: '5 year' },
  ];
  formDegree!: FormGroup;
  formSpecialization!: FormGroup;
  doctorId: any;
  specialityId: any;
  lastCount: any;
  formSubmitted: boolean = false;
  countryList = countries;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  private destroy$: Subject<void> = new Subject<void>();
  sp1or2: any = false;
  todayDate: any = new Date();
  maxdate: any = this.todayDate.year - 18;
  picUploadBtn: any = true;
  nidUploadBtn: any = true;
  stepBack2: any = false;
  stepBack1: any = false;
  errorMessage: string = '';
  startYear = new Date().getFullYear();
  range: any = [];
  minYear = new Date().getFullYear() - 1;
  signUploadBtn!: boolean;
  otpLoader!: boolean;

  constructor(
    private fb: FormBuilder,
    private otpService: OtpService,
    private userAccountService: UserAccountsService,
    private doctorProfileService: DoctorProfileService,
    private patientProfileService: PatientProfileService,
    private _router: Router,
    private normalAuth: AuthService,
    private doctorSpeciality: SpecialityService,
    private degreeService: DegreeService,
    private tosterService: TosterService,
    private specializationService: SpecializationService,
    private specialityService: SpecialityService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private doctorProfilePicService: DocumentsAttachmentService,
    private TosterService: TosterService,
    private datePipe: DatePipe
  ) {
    this.todayDate = this.datePipe.transform(this.todayDate, 'yyyy-MM-dd');
    //this.maxdate = this.datePipe.transform(this.maxdate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.loadForm();
    this.genderList = CommonService.getEnumList(Gender);
    this.doctorSpeciality
      .getList()
      .subscribe((res) => (this.specialties = res));
    this.titleList = CommonService.getEnumList(DoctorTitle);
    //this.doctorProfileService.getList().subscribe((d) => {
    //  this.doctorList = d;
    //  this.lastCount = this.doctorList.length;
    //});
    const authInfo = this.normalAuth.authInfo();
    if (authInfo == null) {
      return;
    }
    this.userType = this.normalAuth.authInfo().userType;
    this.doctorId = authInfo.id;
    this.specialityId = authInfo.specialityId;
    this.profileStep = authInfo.profileStep;
    //if (this.specialityId == 1 || this.specialityId == 2) {
    //  this.sp1or2 = true;
    //}
    //else {
    //  this.sp1or2 = false;
    //}
    if (this.profileStep === 1) {
      this.handleProfileStep1();
    } else if (this.profileStep === 2) {
      this.handleProfileStep2();
    } else {
      this._router.navigate(['/']);
    }
    for (let i = 0; i < 65; i++) {
      this.range.push(this.startYear - i);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subs.unsubscribe();
  }
  //handle profile step 1
  private handleProfileStep1(): void {
    this.otpModal = false;
    this.userInfoModal = false;
    this.completeDegreeSpecilizationInfoModal = true;
    this.doctorName = this.normalAuth.authInfo().doctorName;

    for (let i = 0; i < 65; i++) {
      this.range.push(this.startYear - i);
    }

    this.degreeService.getList().subscribe((res) => {
      this.degreeList = res;
    });

    this.specialityService.get(this.specialityId).subscribe((n) => {
      this.specialityName = n.specialityName;
      //if (this.specialityId > 2) {
      //  this.degreeMendatoryMassage =
      //    'Please provide your degree qualifications as you are a ' +
      //    this.specialityName +
      //    ' specialist.';
      //}
      //else if (this.specialityId == 1) {
      //  this.degreeList = this.degreeList.filter((d) => d.id == 1);
      //}
      //else if (this.specialityId == 2) {
      //  this.degreeList = this.degreeList.filter((d) => d.id == 2);
      //}
      //else {
      //this.degreeList;
      //}
      this.specializationService
        .getListBySpecialtyId(this.specialityId)
        .subscribe((res) => {
          this.specializationList = res;
          //if (this.specialityId == 1) {
          //this.specializationList = this.specializationList.filter(
          //  (s) => s.specialityId == this.specialityId
          //);
          //let specId = this.specializationList.find(
          //  (sp) => sp.specialityId == 1
          //);
          //let uniId = this.GenerateId();
          //let specialzDataForMbbs = {
          //  id: +uniId,
          //  specializationId: specId?.id,
          //  specializationName: specId?.specializationName,
          //  doctorId: this.doctorId,
          //  specialityId: this.specialityId,
          //  specialityName: this.specialityName,
          //};
          //this.doctorSpecializations.push(specialzDataForMbbs);
          //}
          //else if (this.specialityId == 2) {
          //  this.specializationList = this.specializationList.filter(
          //    (s) => s.specialityId == 2
          //  );
          //  let specId = this.specializationList.find(
          //    (sp) => sp.specialityId == 2
          //  );
          //  let uniId = this.GenerateId();
          //  let specialzDataBDS = {
          //    id: +uniId,
          //    specializationId: specId?.id,
          //    specializationName: specId?.specializationName,
          //    doctorId: this.doctorId,
          //    specialityId: this.specialityId,
          //    specialityName: this.specialityName,
          //  };
          //  this.doctorSpecializations.push(specialzDataBDS);
          //}
          //else {
          //  this.spMendatoryMassage =
          //    'Please select at least one specializtion as your a  ' +
          //    this.specialityName +
          //    ' specialist. you select maximum 3 specialization';
          //}
        });
    });
  }
  //handle profile step 2
  private handleSpecializationList(): void {
    this.subs.sink = this.specializationService
      .getListBySpecialtyId(this.specialityId)
      .subscribe((res) => {
        this.specializationList = res;

        if (this.specialityId === 1 || this.specialityId === 2) {
          const specId = this.specializationList.find(
            (sp) => sp.specialityId === this.specialityId
          );

          const uniId = this.GenerateId();
          const specializationData = {
            id: +uniId,
            specializationId: specId?.id,
            specializationName: specId?.specializationName,
            doctorId: this.doctorId,
            specialityId: this.specialityId,
            specialityName: this.specialityName,
          };

          this.doctorSpecializations.push(specializationData);
        } else {
          this.spMendatoryMassage = `You must select specialization for ${this.specialityName}. Max. 3`;
        }
      });
  }
  //handle profile step 3
  private handleProfileStep2(): void {
    this.otpModal = false;
    this.userInfoModal = false;
    this.completeDocumentUpload = true;
    this.subs.sink = this.specialityService
      .get(this.specialityId)
      .subscribe((n) => {
        this.specialityName = n.specialityName;
        if (this.specialityId > 2) {
          this.documentMassage =
            '(You must upload document as you are a ' +
            this.specialityName +
            ' specialist.)';
        } else {
          this.documentMassage =
            '(Just upload a document which can prove that, you a Doctor.)';
        }
      });
  }
  // updated end
  loadForm() {
    this.formGroup = this.fb.group({
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/),
        ],
      ],
      otp: ['', Validators.required],
      userTypeName: ['', Validators.required],
    });
    this.userInfoForm = this.fb.group(
      {
        // fullName: ['', [Validators.required, customNameValidator]],
        fullName: ['', [Validators.required]],
        doctorTitle: ['0', Validators.required],
        email: [''],
        password: [
          this.formGroup.get('userTypeName')?.value == 'Patient'
            ? 'Coppa@123'
            : '',
          Validators.required,
        ],
        confirmPassword: ['', Validators.required],
        age: [''],
        gender: [null],
        bloodGroup: [null],
        dateOfBirth: [''],
        // city: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
        city: [''],
        country: ['Bangladesh', Validators.required],
        address: [''], //,[Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]+$/)],
        zipCode: [''], //, [Validators.required, Validators.pattern(/^\d{4}$/)]
        // bmdcRegNo: ['', [Validators.required, Validators.pattern(/^\d{6,9}$/)]],
        bmdcRegNo: ['', Validators.required],
        bmdcRegExpiryDate: [''], //[Validators.required, yearValidator()]],
        specialityId: ['', Validators.required],
        // identityNumber: [
        //   '',
        //   [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{10,17}$/)],
        // ],
        identityNumber: [''],
        expertise: [''],
      },
      { validator: CustomValidators.matchValidator }
    );
    this.formDegree = this.fb.group({
      zipCode: ['1216'],
      degreeId: ['0', Validators.required],
      duration: ['0'],
      passingYear: ['2000'], //, [Validators.required, customPassingYearValidator]
      instituteName: ['', Validators.required],
      instituteCity: [''],

      instituteCountry: ['Bangladesh', Validators.required], //['',[Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)],],
    });
    if (this.specialityId === 1) {
      this.formSpecialization = this.fb.group({
        specializationId: [1, Validators.required],
        docFileName: [''],
      });
    } else if (this.specialityId === 2) {
      this.formSpecialization = this.fb.group({
        specializationId: [2, Validators.required],
        docFileName: [''],
      });
    } else {
      this.formSpecialization = this.fb.group({
        specializationId: [0, Validators.required],
        docFileName: [''],
      });
    }
  }

  // Future todo : add resend code feature
  // resendCodeEnabled: boolean = true;
  // countdown: number = 120;
  // minutes: number=0;
  // seconds: number=0;

  // initiateResendCode() {
  //   this.resendCodeEnabled = false;
  //   this.startCountdown();
  // }
  // startCountdown() {
  //   const countdownInterval = setInterval(() => {
  //     this.countdown--;
  //     this.calculateTime();
  //     if (this.countdown <= 0) {
  //       this.resendCodeEnabled = true;
  //       this.countdown = 120;
  //       clearInterval(countdownInterval);
  //     }
  //   }, 1000);
  // }
  // calculateTime() {
  //   this.minutes = Math.floor(this.countdown / 60);
  //   this.seconds = this.countdown % 60;
  // }

  passwordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType =
        this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType =
        this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  loadAuth() {
    let authInfo = this.normalAuth.authInfo();
    if (authInfo != null) {
      this.userType = this.normalAuth.authInfo().userType;
      this.doctorId = this.normalAuth.authInfo().id;
      this.specialityId = this.normalAuth.authInfo().specialityId;
      this.profileStep = this.normalAuth.authInfo().profileStep;
      //if (this.specialityId == 1 || this.specialityId == 2) {
      //  this.sp1or2 = true;
      //}
      //else {
      //  this.sp1or2 = false;
      //}
      if (this.profileStep == 1) {
        this.handleProfileStep1();
      } else if (this.profileStep == 2) {
        this.handleProfileStep2();
      }
    }
  }

  sendOtp() {
    this.errorMessage = '';
    this.formSubmitted = true;
    if (
      this.formGroup.get('mobile')?.invalid ||
      this.formGroup.get('userTypeName')?.invalid
    ) {
      return;
    }

    // this.initiateResendCode()
    const mobileNo = this.formGroup.get('mobile')?.value;
    this.mobile = mobileNo;
    let otpData = {
      userName: mobileNo,
      type: 'signup',
    };
    this.isLoading = true;

    if (this.formGroup.get('userTypeName')?.value == 'Patient') {
      this.subs.sink = this.normalAuth.sendOtp(otpData).subscribe({
        next: (res) => {
          if (res) {
            this.otpModal = true;
            this.isLoading = false;
            this.formSubmitted = false;
          }
        },
        error: (err) => {
          this.otpModal = false;
          this.errorMessage = 'Mobile number already in used!';
          this.isLoading = false;
          this.formSubmitted = false;
        },
      });
    } else {
      this.otpModal = false;
      this.isLoading = false;
      this.formSubmitted = false;
      this.userInfoModal = true;
      this.profileStep = 2;
    }
  }

  back() {
    this.otpModal = false;
  }

  // verify() {
  //   this.errorMessage = '';
  //   let otp = this.otp;
  //   this.userInfoModal = true;

  //   if (otp) {
  //     this.subs.sink = this.otpService
  //       .varifyOtp(Number(otp))
  //       .subscribe((res: boolean) => {
  //         if (res) {
  //           this.userInfoModal = res;
  //         } else {
  //           this.errorMessage = 'Invalid Otp!';
  //         }
  //       });
  //   }
  // }

  onOtpChange(pin: any) {
    if (pin.length == 4) {
      this.otp = Number(pin);

      this.userInfoModal = true;
      // this.verify();

      // this.sendUserInfo();
    } else {
      console.log('Pin should be 4 character');
    }
  }

  // updated start
  async sendUserInfo() {
    this.formSubmitted = true;

    // const { fullName } = this.userInfoForm.value;

    // if (
    //   this.formGroup.get('userTypeName')?.value == 'Patient' &&
    //   !fullName
    //   //!email &&
    //   // !password &&
    //   // !confirmPassword
    // ) {
    //   this.TosterService.customToast('All fields is required', 'warning');
    //   return;
    // }

    try {
      this.isLoading = true;

      const userType = this.formGroup?.value.userTypeName;
      this.userType = this.stepBack1 ? this.userType : userType;

      const password =
        this.formGroup?.value.userTypeName === 'Patient'
          ? 'Coppa@123'
          : this.userInfoForm?.value.password;
      const userInfo = {
        tenantId: null,
        userName: this.mobile,
        name: this.userInfoForm?.value.fullName,
        surname: '',
        email:
          this.userType == 'Patient'
            ? this.mobile + '@sg.com'
            : this.userInfoForm.value.email,
        emailConfirmed: true,
        phoneNumber: this.mobile,
        phoneNumberConfirmed: true,
        isActive: true,
        lockoutEnabled: false,
        lockoutEnd: '2023-07-16T07:38:44.382Z',
        role: this.userType,
        password: password,
        otp: this.userType == 'Patient' ? this.otp : null,
      };
      console.log('start');

      if (this.stepBack1 == false) {
        // const res: UserSignUpResultDto | undefined =
        this.normalAuth.signup(userInfo).subscribe({
          next: (res) => {
            this.otpLoader = false;
            if (res.message) {
              if (this.userType === 'Doctor') {
                this.handleDoctorProfile(res.userData);
              } else if (this.userType === 'Patient') {
                this.handlePatientProfile(res.userData);
              }
            } else {
              this.tosterService.customToast(res.message, 'error');

              this.otpLoader = false;
              console.log(res.message);
            }
          },
          error: (err) => {
            console.log(err);
            this.otpLoader = false;
            this.tosterService.customToast('Server response error', 'error');
            this.isLoading = false;
          },
        });
      } else {
        // const authInfo = this.normalAuth.authInfo();
        // const signupResDto: UserSignUpResultDto = {} as UserSignUpResultDto;
        // signupResDto.userId = authInfo.userId;
        // signupResDto.name = authInfo.doctorName;
        // signupResDto.email = authInfo.email;
        // signupResDto.phoneNumber = authInfo.mobileNo;
        // if (this.userType === 'Doctor') {
        //   this.handleDoctorProfile(signupResDto);
        // } else if (this.userType === 'Patient') {
        //   this.handlePatientProfile(signupResDto);
        // }
      }
    } catch (err) {
      console.error('Error occurred:', err);
      this.isLoading = false;
    }
  }

  private handleDoctorProfile(res: UserSignUpResultDto) {
    const authInfo = this.normalAuth.authInfo();
    this.doctorProfileDto = {
      id: this.stepBack1 == false ? 0 : authInfo.id,
      doctorTitle: this.userInfoForm.value.doctorTitle,
      userId: res.userId,
      fullName: res.name,
      email: res.email,
      mobileNo: res.phoneNumber,
      gender: this.userInfoForm.value.gender,
      dateOfBirth: this.userInfoForm.value.dateOfBirth,
      address: this.userInfoForm.value.address,
      city: this.userInfoForm.value.city,
      zipCode: this.userInfoForm.value.zipCode,
      country: this.userInfoForm.value.country,
      bmdcRegNo: this.userInfoForm.value.bmdcRegNo,
      bmdcRegExpiryDate: this.userInfoForm.value.bmdcRegExpiryDate,
      specialityId: this.userInfoForm.value.specialityId,
      identityNumber: this.userInfoForm.value.identityNumber,
      expertise: '',
      isActive: false,
      profileStep: 1,
      createFrom: 'Web',
    };
    if (this.stepBack1 == false) {
      this.doctorProfileService
        .create(this.doctorProfileDto)
        .subscribe((profRes: any) => {
          this.subs.sink = this.doctorProfileService
            .getByUserId(profRes.userId)
            .subscribe((doctorDto: DoctorProfileInputDto) => {
              this.isLoading = false;
              this.newCreatedProfileDto = doctorDto;
              this.completeDegreeSpecilizationInfoModal = true;
              this.docId = doctorDto.id;

              const saveLocalStorage = {
                identityNumber: doctorDto.identityNumber,
                doctorName: doctorDto.fullName,
                email: doctorDto.email,
                mobileNo: doctorDto.mobileNo,
                bmdcRegNo: doctorDto.bmdcRegNo,
                isActive: doctorDto.isActive,
                userId: doctorDto.userId,
                id: doctorDto.id,
                specialityId: doctorDto.specialityId,
                profileStep: doctorDto.profileStep,
                createFrom: doctorDto.createFrom,
                userType: this.userType.toLocaleLowerCase(),
              };

              this.normalAuth.setAuthInfoInLocalStorage(saveLocalStorage);

              if (this.normalAuth) {
                this.loadAuth();
              }

              this.tosterService.customToast(
                'Basic Information Saved Successfully',
                'success'
              );
              this.isLoading = false;
              this.cdRef.detectChanges();
            });
        });
    } else {
      this.doctorProfileService
        .update(this.doctorProfileDto)
        .subscribe((profRes: any) => {
          this.isLoading = false;
          //this.subs.sink =
          //this.doctorProfileService
          //  .getByUserId(profRes.userId)
          //  .subscribe((doctorDto: DoctorProfileInputDto) => {
          //this.newCreatedProfileDto = doctorDto;
          this.completeDegreeSpecilizationInfoModal = true;
          this.docId = profRes.id;

          const saveLocalStorage = {
            identityNumber: profRes.identityNumber,
            doctorName: profRes.fullName,
            email: profRes.email,
            mobileNo: profRes.mobileNo,
            bmdcRegNo: profRes.bmdcRegNo,
            isActive: profRes.isActive,
            userId: profRes.userId,
            id: profRes.id,
            specialityId: profRes.specialityId,
            profileStep: profRes.profileStep,
            createFrom: profRes.createFrom,
            userType: this.userType,
          };
          this.normalAuth.setAuthInfoInLocalStorage(saveLocalStorage);

          if (this.normalAuth) {
            this.loadAuth();
          }

          this.tosterService.customToast(
            'Basic Information Update Successfully',
            'success'
          );
          this.isLoading = false;
          this.cdRef.detectChanges();
          //});
        });

      this.stepBack1 = false;
    }
  }

  private handlePatientProfile(res: UserSignUpResultDto) {
    const { age, fullName, bloodGroup, gender } = this.userInfoForm.value;
    console.log({
      age,
      fullName,
      bloodGroup,
      gender,
      mobileNo: this.mobile,
      userId: res.userId,
    });

    this.patientProfileService
      .create({
        age,
        fullName,
        bloodGroup,
        gender,
        mobileNo: this.mobile,
        userId: res.userId,
      })
      .subscribe((patientDto: PatientProfileDto) => {
        this.otpLoader = false;
        this.isLoading = false;
        //const saveLocalStorage = {
        //  fullName: patientDto.fullName,
        //  email: patientDto.email,
        //  mobileNo: patientDto.mobileNo,
        //  userId: res.userId,
        //  id: patientDto.id,
        //  userType: this.userType.toLowerCase(),
        //};

        //this.normalAuth.setAuthInfoInLocalStorage(saveLocalStorage);
        //const navigate = `${this.formGroup?.value.userTypeName}/profile-settings`;
        //const navigate = `${this.formGroup?.value.userTypeName}/dashboard`;

        //this._router.navigate([navigate.toLowerCase()], {
        //  state: { data: res }, // Pass the 'res' object as 'data' in the state object
        //});

        //if (this.normalAuth) {
        //  this.loadAuth();
        //}

        this.normalAuth.signOut();
        //if (this.normalAuth) {
        //  this.loadAuth();
        //}
        //let navUrl = this.userType.toLowerCase() + '/dashboard';
        this.isLoading = false;
        this._router
          .navigate(['/login'], {
            state: { data: res }, // Pass the 'res' object as 'data' in the state object
          })
          .then((r) =>
            this.tosterService.customToast(
              'Patient Registration Successfull. Now login.',
              'success'
            )
          );

        //this.tosterService.customToast('Patient Registration Successfull. Now login.', 'success');
        this.cdRef.detectChanges();
      });
  }

  handleComponent(event: boolean) {
    if (event) {
      this.cdRef.detectChanges();
    }
  }
  // updated end

  handleFormData(formData: FormGroup) {
    const doctorProfileInput: DoctorProfileInputDto = {
      degrees: [],
      doctorSpecialization: [],
      //...formData,

      id: this.docId,
    };
    doctorProfileInput.doctorTitle = this.doctorProfileDto.doctorTitle;
    doctorProfileInput.userId = this.doctorProfileDto.userId;
    doctorProfileInput.fullName = this.doctorProfileDto.fullName;
    doctorProfileInput.email = this.doctorProfileDto.email;
    doctorProfileInput.mobileNo = this.doctorProfileDto.mobileNo;
    doctorProfileInput.isActive = this.doctorProfileDto.isActive;
    doctorProfileInput.profileStep = 1;
    doctorProfileInput.createFrom = 'Web';
    let userType =
      this.formGroup?.value.userTypeName + '/profile-settings/basic-info';
    this.doctorProfileService.update(doctorProfileInput).subscribe((res) => {
      if (res) {
        let saveLocalStorage = {
          identityNumber: res.identityNumber,
          doctorName: res.fullName,
          bmdcRegNo: res.bmdcRegNo,
          isActive: res.isActive,
          userId: res.userId,
          id: res.id,
          specialityId: res.specialityId,
          profileStep: res.profileStep,
          createFrom: res.createFrom,
        };
        this.normalAuth.setAuthInfoInLocalStorage(saveLocalStorage);
        this._router
          .navigate([userType.toLowerCase()], {
            state: { data: res }, // Pass the 'res' object as 'data' in the state object
          })
          .then((r) => r);
        this.tosterService.customToast('Registration Successful', 'success');
      }
    });
  }

  //Education And Specialization
  getDegreeName(event: any) {
    let t = event.target.value;
    this.subs.sink = this.degreeService.get(t).subscribe((n) => {
      this.degreeName = n.degreeName;
    });
  }

  getSpName(event: any): void {
    let t = event.target.value;
    this.subs.sink = this.specializationService.get(t).subscribe((n) => {
      this.specializationName = n.specializationName;
    });
  }

  addDegree() {
    this.formSubmitted = true;
    let degreeId = this.formDegree.get('degreeId')?.value;
    let duration = this.formDegree.get('duration')?.value;

    let uniqueId = this.GenerateId();
    const newDegreeData = {
      ...this.formDegree.value,
      id: uniqueId,
      degreeId: Number(degreeId),
      degreeName: this.degreeName,
      duration: Number(duration),
      doctorId: this.doctorId,
    };

    if (this.formDegree.invalid) {
      this.tosterService.customToast(
        'Please fill all the required fields!',
        'warning'
      );
      return;
    }
    if (this.doctorDegrees.length > 0) {
      this.doctorDegrees.forEach((d) => {
        let dname = this.doctorDegrees.find(
          (n) => n.degreeId == degreeId
        )?.degreeName;
        if (d.degreeId == degreeId) {
          this.tosterService.customToast(dname + ' already added', 'warning');
        } else {
          this.doctorDegrees.push(newDegreeData);
        }
      });
    } else {
      this.doctorDegrees.push(newDegreeData);
    }
  }

  addSpecialization() {
    let spId = this.formSpecialization.get('specializationId')?.value;
    let fileName = this.formSpecialization.get('docFileName')?.value;
    let specialityName = this.specialityName;

    let uniId = this.GenerateId();
    const spData = {
      ...this.formSpecialization.value,
      id: uniId,
      specializationId: Number(spId),
      specializationName: this.specializationName,
      doctorId: this.doctorId,
      specialityId: this.specialityId,
      specialityName: specialityName,
      documentName: this.selectedSpFileName,
    };

    if (!this.formSpecialization.valid && !this.formSpecialization.touched) {
      this.tosterService.customToast(
        'Please fill all the required fields!',
        'warning'
      );
      return;
    }
    if (this.doctorSpecializations.length > 0) {
      this.doctorSpecializations.forEach((d) => {
        let dname = this.doctorSpecializations.find(
          (n) => n.specializationId == spId
        )?.specializationName;
        if (d.specializationId == spId) {
          this.tosterService.customToast(dname + ' already added', 'warning');
          //return;
        } else {
          this.doctorSpecializations.push(spData);
        }
      });
    } else {
      this.doctorSpecializations.push(spData);
    }
  }

  remove(id: any): void {
    let objectIndex = 0;
    objectIndex = this.doctorDegrees.findIndex(
      (obj) => obj.id?.toString() === id
    );
    if (objectIndex > -1) {
      this.doctorDegrees.splice(objectIndex, 1);
    }
  }

  removeSp(id: any): void {
    let objectIndex = 0;
    objectIndex = this.doctorSpecializations.findIndex(
      (obj) => obj.id?.toString() === id
    );
    if (objectIndex > -1) {
      this.doctorSpecializations.splice(objectIndex, 1);
    }
  }

  saveDegreeSpecialization() {
    this.isLoading = true;

    if (
      this.doctorDegrees.length === 0 ||
      this.doctorSpecializations.length === 0
    ) {
      this.isLoading = false;
      this.tosterService.customToast(
        'You have to add your medical degees and specializations',
        'warning'
      );

      return;
    } else {
      /* else if (
      //  this.specialityId > 1 &&
      //  this.specialityId > 2 &&
      //  this.doctorDegrees.length == 1
      //) {
      //  this.tosterService.customToast(
      //    'You have to add your degrees according to you speciality',
      //    'warning'
      //  );
      //  return;
      //}
      //else if (this.doctorSpecializations.length > 3) {
      //  this.tosterService.customToast(
      //    'You are exeeding Specialization Limit.',
      //    'warning'
      //  );
      //  return;
      //} */
      this.doctorDegrees.forEach((d) => {
        let ddDto: DoctorDegreeDto = {} as DoctorDegreeDto;
        ddDto.degreeId = d.degreeId;
        ddDto.doctorProfileId = this.doctorId;
        ddDto.duration = d.duration;
        ddDto.passingYear = d.passingYear;
        ddDto.instituteName = d.instituteName;
        ddDto.instituteCity = d.instituteCity;
        ddDto.instituteCountry = d.instituteCountry;
        this.doctorDegreeInputs.push(ddDto);
      });
      this.doctorSpecializations.forEach((s) => {
        let spDto: DoctorSpecializationDto = {} as DoctorSpecializationDto;
        spDto.doctorProfileId = this.doctorId;
        spDto.specialityId = s.specialityId;
        spDto.specializationId = s.specializationId;
        spDto.documentName = s.documentName;
        this.doctorSpecializationInputs.push(spDto);
      });
      this.subs.sink = this.doctorProfileService
        .get(this.doctorId)
        .subscribe((doctorDto: DoctorProfileInputDto) => {
          if (doctorDto) {
            this.forStepUpdateDto.id = doctorDto.id;
            this.forStepUpdateDto.doctorCode = doctorDto.doctorCode;
            this.forStepUpdateDto.doctorTitle = doctorDto.doctorTitle;
            this.forStepUpdateDto.userId = doctorDto.userId;
            this.forStepUpdateDto.fullName = doctorDto.fullName;
            this.forStepUpdateDto.email = doctorDto.email;
            this.forStepUpdateDto.mobileNo = doctorDto.mobileNo;
            this.forStepUpdateDto.gender = doctorDto.gender;
            this.forStepUpdateDto.dateOfBirth = doctorDto.dateOfBirth;
            this.forStepUpdateDto.address = doctorDto.address;
            this.forStepUpdateDto.city = doctorDto.city;
            this.forStepUpdateDto.zipCode = doctorDto.zipCode;
            this.forStepUpdateDto.country = doctorDto.country;
            this.forStepUpdateDto.bmdcRegNo = doctorDto.bmdcRegNo;
            this.forStepUpdateDto.bmdcRegExpiryDate =
              doctorDto.bmdcRegExpiryDate;
            this.forStepUpdateDto.specialityId = doctorDto.specialityId;
            this.forStepUpdateDto.identityNumber = doctorDto.identityNumber;
            this.forStepUpdateDto.isActive = false;
            this.forStepUpdateDto.profileStep = 2;
            this.forStepUpdateDto.createFrom = 'Web';
            this.forStepUpdateDto.expertise = doctorDto.expertise;
            this.forStepUpdateDto.degrees = this.doctorDegreeInputs; // .push(this.doctorDegrees);
            this.forStepUpdateDto.doctorSpecialization =
              this.doctorSpecializationInputs;

            this.subs.sink = this.doctorProfileService
              .update(this.forStepUpdateDto)
              .subscribe((res: DoctorProfileDto) => {
                if (res) {
                  if (this.totalSpFileList.length > 0) {
                    for (let item of this.totalSpFileList) {
                      this.spFileData = new FormData();
                      this.spFileData.append(
                        'entityId',
                        this.doctorId.toString()
                      );
                      this.spFileData.append('entityType', 'Doctor');
                      this.spFileData.append(
                        'attachmentType',
                        'DoctorSpecialityDoc'
                      );
                      this.spFileData.append(
                        'directoryName',
                        'DoctorExperties\\' + this.doctorId.toString()
                      );

                      let fileToUpload = item;
                      this.spFileData.append(item.name, fileToUpload);
                      this.http
                        .post(
                          `${this.apiUrl}/Common/Documents`,
                          this.spFileData
                        )
                        .subscribe(
                          (result: any) => {
                            this.tosterService.customToast(
                              'Documents for Specializations Uploaded Successfully',
                              'success'
                            );
                            this.cdRef.detectChanges();
                          },
                          (err) => {
                            console.log(err);
                          }
                        );
                    }
                  }
                  this.completeDegreeSpecilizationInfoModal = false;
                  this.completeDocumentUpload = true;
                  let saveLocalStorage = {
                    identityNumber: res.identityNumber,
                    doctorName: res.fullName,
                    email: doctorDto.email,
                    mobileNo: doctorDto.mobileNo,
                    bmdcRegNo: res.bmdcRegNo,
                    isActive: res.isActive,
                    userId: res.userId,
                    id: res.id,
                    specialityId: res.specialityId,
                    profileStep: res.profileStep,
                    createFrom: res.createFrom,
                    specializations: res.doctorSpecialization,
                    userType: this.userType,
                  };
                  this.normalAuth.setAuthInfoInLocalStorage(saveLocalStorage);
                  if (this.normalAuth) {
                    this.loadAuth();
                  }
                  this.tosterService.customToast(
                    'Degree and Specializtion info updated Successfully',
                    'success'
                  );
                  this.isLoading = false;
                  this.cdRef.detectChanges();
                }
              });
          }
        });
    }
  }

  GenerateId(): string {
    return '_' + Math.random().toString().substring(2, 9);
  }

  uploadPic() {
    this.fileData.append('entityId', this.doctorId.toString());
    this.fileData.append('entityType', 'Doctor');
    this.fileData.append('attachmentType', 'ProfilePicture');
    this.fileData.append(
      'directoryName',
      'DoctorProfilePicture\\' + this.doctorId.toString()
    );
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
            this.tosterService.customToast(
              'Picture Changed Successfully',
              'success'
            );
            this.getProfilePic();
          },
          (err) => {
            console.log(err);
          }
        );
    }
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
            this.getSign();
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  uploadSpDoc() {
    this.spFileData.append('entityId', this.doctorId.toString());
    this.spFileData.append('entityType', 'Doctor');
    this.spFileData.append('attachmentType', 'DoctorSpecialityDoc');
    this.spFileData.append(
      'directoryName',
      'DoctorSpecialityDoc\\' + this.doctorId.toString()
    );
    if (this.spFileList.length > 0) {
      for (let item of this.spFileList) {
        let fileToUpload = item;
        this.spFileData.append(item.name, fileToUpload);
      }
      // save attachment
      this.http
        .post(`${this.apiUrl}/Common/Documents`, this.spFileData)
        .subscribe(
          (result: any) => {
            this.tosterService.customToast(
              'Documents for Specializations Uploaded Successfully',
              'success'
            );
          },
          (err) => {
            console.log(err);
          }
        );
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
    this.picUploadBtn = true;
  }

  onIdFileChanged(event: any) {
    console.log(event);

    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.idFileList.push(selectedFile);
      this.idFileNames.push(selectedFile.name);
    }
    if (this.idFileList.length > 0) {
      this.checkIdFileValidation(event);
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
      this.checkSignFileValidation(event);
    }
    this.signAttachments.nativeElement.value = '';
    this.signUploadBtn = true;
  }
  onSpFileChanged(event: any) {
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      this.spFileList.push(selectedFile);
      this.spFileNames.push(selectedFile.name);
      this.selectedSpFileName = selectedFile.name;
    }
    if (this.spFileList.length > 0) {
      this.checkSpFileValidation(event);
    }
    //this.spFileCount = this.spFileCount + this.spFileList.length;
    this.spAttachment.nativeElement.value = '';
  }

  removeSelectedFile(index: any) {
    // delete file name from fileNames list
    this.fileNames.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
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
  removeSpSelectedFile(index: any) {
    // delete file name from fileNames list
    this.spFileNames.splice(index, 1);
    // delete file from FileList
    this.spFileList.splice(index, 1);

    //this.formSpecialization.setValue(['docFileName',''])
    this.selectedSpFileName = '';
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

  checkIdFileValidation(event: any) {
    let count = event.target.files.length;
    if (count > 0) {
      var allowedFiles = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/pdf',
      ];
      const files: File[] = event.target.files;
      this.idFileList = Array.from(files);
      for (let i = 0; i < count; i++) {
        if (files[i].size > 5242880) {
          this.idFileNames.splice(i, 1);
          this.idFileList.splice(i, 1);

          this.tosterService.customToast('Maximum 5MB Accepted', 'warning');
          //this.toastr.warning('Maximum 5MB Accepted.', 'Warning');
        }
        if (!(allowedFiles.indexOf(files[i].type.toLowerCase()) >= 0)) {
          this.idFileNames.splice(i, 1);
          this.idFileList.splice(i, 1);
          this.tosterService.customToast(
            'Only jpeg & jpg are Accepted.',
            'warning'
          );
        }
      }
    }
  }

  checkSignFileValidation(event: any) {
    let count = event.target.files.length;
    if (count > 0) {
      var allowedFiles = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/pdf',
      ];
      const files: File[] = event.target.files;
      this.signFileList = Array.from(files);
      for (let i = 0; i < count; i++) {
        if (files[i].size > 5242880) {
          this.signFileNames.splice(i, 1);
          this.signFileList.splice(i, 1);

          this.tosterService.customToast('Maximum 5MB Accepted', 'warning');
          //this.toastr.warning('Maximum 5MB Accepted.', 'Warning');
        }
        if (!(allowedFiles.indexOf(files[i].type.toLowerCase()) >= 0)) {
          this.signFileNames.splice(i, 1);
          this.signFileList.splice(i, 1);
          this.tosterService.customToast(
            'Only jpeg & jpg are Accepted.',
            'warning'
          );
        }
      }
    }
  }
  checkSpFileValidation(event: any) {
    let count = event.target.files.length;
    if (count > 0) {
      var allowedFiles = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/pdf',
      ];
      const files: File[] = event.target.files;
      this.spFileList = Array.from(files);
      for (let i = 0; i < count; i++) {
        if (files[i].size > 5242880) {
          this.spFileNames.splice(i, 1);
          this.spFileList.splice(i, 1);
          this.tosterService.customToast('Maximum 5MB Accepted', 'warning');
          //this.toastr.warning('Maximum 5MB Accepted.', 'Warning');
        }
        if (!(allowedFiles.indexOf(files[i].type.toLowerCase()) >= 0)) {
          this.spFileNames.splice(i, 1);
          this.spFileList.splice(i, 1);
          this.tosterService.customToast(
            'Only jpeg & jpg are Accepted.',
            'warning'
          );
        }
        this.totalSpFileList.push(files[i]);
      }
    }
  }

  getProfilePic() {
    this.doctorProfilePicService
      .getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType(
        'Doctor',
        this.doctorId,
        'ProfilePicture'
      )
      .subscribe((at: any) => {
        if (at) {
          let prePaths: string = '';
          var re = /wwwroot/gi;
          prePaths = at.path ? at.path : '';
          this.profilePic = prePaths.replace(re, '');
          this.profPicUrl = this.picUrl + this.profilePic;
        }
      });
    this.picUploadBtn = false;
  }

  getNID() {
    this.doctorProfilePicService
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
      });
    this.nidUploadBtn = false;
  }

  getSign() {
    this.doctorProfilePicService
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
      });
    this.signUploadBtn = false;
  }
  finalContinue() {
    this.isLoading = true;
    //this.userType = this.normalAuth.authInfo().userType;
    //let userType = this.userType.toString().toLowerCase();
    this.subs.sink = this.doctorProfileService
      .get(this.doctorId)
      .subscribe((doctorDto: DoctorProfileInputDto) => {
        if (doctorDto) {
          this.forStepUpdateDto.id = doctorDto.id;
          this.forStepUpdateDto.doctorCode = doctorDto.doctorCode;
          this.forStepUpdateDto.doctorTitle = doctorDto.doctorTitle;
          this.forStepUpdateDto.userId = doctorDto.userId;
          this.forStepUpdateDto.fullName = doctorDto.fullName;
          this.forStepUpdateDto.email = doctorDto.email;
          this.forStepUpdateDto.mobileNo = doctorDto.mobileNo;
          this.forStepUpdateDto.gender = doctorDto.gender;
          this.forStepUpdateDto.dateOfBirth = doctorDto.dateOfBirth;
          this.forStepUpdateDto.address = doctorDto.address;
          this.forStepUpdateDto.city = doctorDto.city;
          this.forStepUpdateDto.zipCode = doctorDto.zipCode;
          this.forStepUpdateDto.country = doctorDto.country;
          this.forStepUpdateDto.bmdcRegNo = doctorDto.bmdcRegNo;
          this.forStepUpdateDto.bmdcRegExpiryDate = doctorDto.bmdcRegExpiryDate;
          this.forStepUpdateDto.specialityId = doctorDto.specialityId;
          this.forStepUpdateDto.identityNumber = doctorDto.identityNumber;
          this.forStepUpdateDto.isActive = doctorDto.isActive;
          this.forStepUpdateDto.profileStep = 3;
          this.forStepUpdateDto.createFrom = doctorDto.expertise;
          this.forStepUpdateDto.createFrom = doctorDto.createFrom;
          this.forStepUpdateDto.degrees = []; // .push(this.doctorDegrees);
          this.forStepUpdateDto.doctorSpecialization = [];

          this.subs.sink = this.doctorProfileService
            .update(this.forStepUpdateDto)
            .subscribe((res: DoctorProfileDto) => {
              if (res) {
                this.completeDegreeSpecilizationInfoModal = false;
                this.completeDocumentUpload = true;
                //let saveLocalStorage = {
                //  identityNumber: res.identityNumber,
                //  doctorName: res.fullName,
                //  bmdcRegNo: res.bmdcRegNo,
                //  isActive: res.isActive,
                //  userId: res.userId,
                //  id: res.id,
                //  specialityId: res.specialityId,
                //  profileStep: res.profileStep,
                //  createFrom: res.createFrom,
                //  userType: this.userType, //this.userType.toString().toLowerCase()//loginResponse.roleName.toString().toLowerCase()
                //};
                //this.normalAuth.setAuthInfoInLocalStorage(saveLocalStorage);
                this.normalAuth.signOut();
                //if (this.normalAuth) {
                //  this.loadAuth();
                //}
                //let navUrl = this.userType.toLowerCase() + '/dashboard';
                let message =
                  'Congratulations..!! Doctor Profile Created Successfully. You can login now.';

                this._router
                  .navigate(['/login'], {
                    state: { data: res }, // Pass the 'res' object as 'data' in the state object
                  })
                  .then((r) =>
                    this.tosterService.customToast(message, 'success')
                  );
                //this.tosterService.success("Degree and Specializtion info updated Successfully"),
                this.isLoading = false;
                this.cdRef.detectChanges();
              }
            });
        }
      });
  }

  getErrorMessage(filed: string) {
    if (
      filed == 'mobile' &&
      this.formGroup.get('mobile')?.hasError('required')
    ) {
      return 'You must enter a valid mobile number';
    }

    if (
      filed == 'userTypeName' &&
      this.formGroup.get('userTypeName')?.hasError('required')
    ) {
      return 'Select your type';
    }
    return;
  }

  getBackStep1Data() {
    let authInfo = this.normalAuth.authInfo();
    let profileId = authInfo.id;
    this.doctorProfileService.get(profileId).subscribe((res) => {
      this.completeDegreeSpecilizationInfoModal = false;
      this.userInfoModal = true;
      this.stepBack1 = true;

      this.doctorProfileDto = {
        id: res.id,
        fullName: res.fullName,
        doctorTitle: res.doctorTitle,
        mobileNo: res.mobileNo,
        email: res.email,
        gender: res.gender,
        dateOfBirth: res.dateOfBirth,
        address: res.address,
        city: res.city,
        zipCode: res.zipCode,
        country: res.country,
        bmdcRegNo: res.bmdcRegNo,
        bmdcRegExpiryDate: res.bmdcRegExpiryDate,
        specialityId: res.specialityId,
        identityNumber: res.identityNumber,
        isActive: res.isActive,
        profileStep: res.profileStep,
        createFrom: res.createFrom,
        userId: res.userId,
        expertise: res.expertise,
      };

      this.userInfoForm.patchValue({
        fullName: this.doctorProfileDto.fullName,
        doctorTitle: this.doctorProfileDto.doctorTitle,
        expertise: this.doctorProfileDto.expertise,
        email: this.doctorProfileDto.email,
        gender: this.doctorProfileDto.gender,
        dateOfBirth: formatDate(
          this.doctorProfileDto.dateOfBirth,
          'yyyy-MM-dd',
          'en'
        ), //this.doctorProfileDto.dateOfBirth,
        address: this.doctorProfileDto.address,
        city: this.doctorProfileDto.city,
        country: this.doctorProfileDto.country,
        zipCode: this.doctorProfileDto.zipCode,
        bmdcRegNo: this.doctorProfileDto.bmdcRegNo,
        bmdcRegExpiryDate: formatDate(
          this.doctorProfileDto.bmdcRegExpiryDate,
          'yyyy-MM-dd',
          'en'
        ), //this.doctorProfileDto.bmdcRegExpiryDate,
        specialityId: this.doctorProfileDto.specialityId,
        identityNumber: this.doctorProfileDto.identityNumber,
      });
      this.doctorSpecializations = [];
      this.doctorDegrees = [];
      this.isLoading = false;
    });
  }
  addExpertise() {
    let expertise = this.userInfoForm.get('expertise')?.value;

    this.doctorProfileService
      .updateExpertiseByIdAndExpertise(this.doctorId, expertise)
      .subscribe((res) =>
        this.tosterService.customToast('Successfully added!', 'success')
      );
  }
  getBackStep2Data() {
    let authInfo = this.normalAuth.authInfo();
    let profileId = authInfo.id;
    this.completeDocumentUpload = false;
    this.handleProfileStep1();
    this.doctorSpecializations = [];
    this.doctorDegrees = [];
    //this.doctorProfileService.get(profileId).subscribe(res => {
    //  //this.completeDocumentUpload = false;
    //  //this.completeDegreeSpecilizationInfoModal = true;
    //  this.forStepUpdateDto.id = res.id;
    //  this.forStepUpdateDto.doctorCode = res.doctorCode;
    //  this.forStepUpdateDto.doctorTitle = res.doctorTitle;
    //  this.forStepUpdateDto.userId = res.userId;
    //  this.forStepUpdateDto.fullName = res.fullName;
    //  this.forStepUpdateDto.email = res.email;
    //  this.forStepUpdateDto.mobileNo = res.mobileNo;
    //  this.forStepUpdateDto.gender = res.gender;
    //  this.forStepUpdateDto.dateOfBirth = res.dateOfBirth;
    //  this.forStepUpdateDto.address = res.address;
    //  this.forStepUpdateDto.city = res.city;
    //  this.forStepUpdateDto.zipCode = res.zipCode;
    //  this.forStepUpdateDto.country = res.country;
    //  this.forStepUpdateDto.bmdcRegNo = res.bmdcRegNo;
    //  this.forStepUpdateDto.bmdcRegExpiryDate = res.bmdcRegExpiryDate;
    //  this.forStepUpdateDto.specialityId = res.specialityId;
    //  this.forStepUpdateDto.identityNumber = res.identityNumber;
    //  this.forStepUpdateDto.isActive = res.isActive;
    //  this.forStepUpdateDto.profileStep = res.profileStep;
    //  this.forStepUpdateDto.createFrom = res.createFrom;
    //  this.forStepUpdateDto.degrees = res.degrees;//this.doctorDegreeInputs; // .push(this.doctorDegrees);
    //  this.forStepUpdateDto.doctorSpecialization = res.doctorSpecialization;//this.doctorSpecializationInputs;
    //  let uniqueId = this.GenerateId();
    //  res.degrees.forEach((d: any) => {
    //    let ddDto: DoctorDegreeDto = {} as DoctorDegreeDto;
    //    let dName: any = '';
    //    this.degreeService.get(d.degreeId).subscribe((n) => {
    //      dName = n.degreeName;
    //    });
    //    ddDto.degreeId = d.degreeId;
    //    ddDto.doctorProfileId = this.doctorId;
    //    ddDto.duration = d.duration;
    //    ddDto.passingYear = d.passingYear;
    //    ddDto.instituteName = d.instituteName;
    //    ddDto.instituteCity = d.instituteCity;
    //    ddDto.instituteCountry = d.instituteCountry;
    //    ddDto.degreeName = dName;
    //    //this.doctorDegreeInputs.push(ddDto);
    //    const newDegreeData = {
    //      //id: uniqueId,
    //      degreeId: Number(ddDto.degreeId),
    //      degreeName: dName,
    //      duration: Number(ddDto.duration),
    //      doctorId: this.doctorId,
    //      passingYear: ddDto.passingYear,
    //      instituteName: ddDto.instituteName
    //    };
    //    this.doctorDegrees.push(newDegreeData);
    //  });

    //  res.doctorSpecialization.forEach((s) => {
    //    let spDto: DoctorSpecializationDto = {} as DoctorSpecializationDto;

    //    spDto.doctorProfileId = this.doctorId;
    //    spDto.specialityId = s.specialityId;
    //    spDto.specializationId = s.specializationId;
    //    spDto.documentName = s.documentName;
    //    this.doctorSpecializations.push(spDto);
    //  });

    //})
  }
}
