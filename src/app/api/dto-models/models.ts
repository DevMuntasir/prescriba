import type { EntityDto, FullAuditedEntityDto } from '../models/base-entity';
import type { ConsultancyType } from '../enums/consultancy-type.enum';
import type { AppointmentType } from '../enums/appointment-type.enum';
import type { AppointmentStatus } from '../enums/appointment-status.enum';
import type { AppointmentPaymentStatus } from '../enums/appointment-payment-status.enum';
import type { ChamberPaymentType } from '../enums/chamber-payment-type.enum';
import type { DoctorTitle } from '../enums/doctor-title.enum';
import type { DiagonsticServiceType } from '../enums/diagonstic-service-type.enum';
import type { ServiceRequestStatus } from '../enums/service-request-status.enum';
import type { Gender } from '../enums/gender.enum';
import type { MaritalStatus } from '../enums/marital-status.enum';
import type { ScheduleType } from '../enums/schedule-type.enum';
import type { EntityType } from '../enums/entity-type.enum';
import type { AttachmentType } from '../enums/attachment-type.enum';
import type { FacilityEntityType } from '../enums/facility-entity-type.enum';
import type { OtpStatus } from '../enums/otp-status.enum';
import type { PromoType } from '../enums/promo-type.enum';

export interface AccountDeteleResponsesDto {
  userName?: string;
  name?: string;
  success?: boolean;
  message?: string;
}

export interface AgentMasterDto extends FullAuditedEntityDto<number> {
  agentMasterOrgName?: string;
  agentMasterCode?: string;
  contactPerson?: string;
  contactPersonOfficeId?: string;
  contactPersonIdentityNumber?: string;
  contactPersongMobileNo?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  phoneNo?: string;
  email?: string;
  emergencyContact?: string;
  agentMasterDocNumber?: string;
  agentMasterDocExpireDate?: string;
  isActive?: boolean;
  userId?: string;
  displayName?: string;
  selectedDoctor: MasterDoctorDto[];
}

export interface AgentProfileDto extends FullAuditedEntityDto<number> {
  agentMasterId?: number;
  agentMasterName?: string;
  agentSupervisorId?: number;
  agentSupervisorName?: string;
  fullName?: string;
  agentCode?: string;
  organizationName?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  mobileNo?: string;
  email?: string;
  isActive?: boolean;
  userId?: string;
  profileStep?: number;
  createFrom?: string;
  agentDocNumber?: string;
  agentDocExpireDate?: string;
}

export interface AgentSupervisorDto extends FullAuditedEntityDto<number> {
  agentMasterId?: number;
  agentMasterName?: string;
  agentSupervisorOrgName?: string;
  agentSupervisorCode?: string;
  supervisorName?: string;
  supervisorIdentityNumber?: string;
  supervisorMobileNo?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  phoneNo?: string;
  email?: string;
  emergencyContact?: string;
  agentSupervisorDocNumber?: string;
  agentSupervisorDocExpireDate?: string;
  isActive?: boolean;
  userId?: string;
  displayName?: string;
}

export interface AppointmentDto extends FullAuditedEntityDto<number> {
  appointmentId: number | string;
  appointmentSerial:number;
  patientID: number;
  patientName: string;
  bloodGroup: string; // could be union later like "A" | "B" | "AB" | "O" | ...
  gender: string;     // could be "Male" | "Female" | "Other"
  patientAge: number;
  sessionId: number;
  scheduleId: number;
  phoneNumber: string;
  scheduleName: string;
  sessionName: string | null;
  appointmentDate: string; // "11/29/2025 02:12:00" (if you parse to Date, change to Date)
  serialNo: number;
  isDeleted: boolean;
  doctorScheduleName: string | null;
  scheduleDayofWeek: string; // could be union of weekdays
  startTime: string; // "08:12"
  endTime: string;   // "09:13"
  noOfPatients: number;
  isActive: boolean;
  scheduleTypeName: string;
  consultancyTypeName: string;
  doctorChamberId: number;
  chamber: string;
  status: string | null;
  offDayFrom: string | null;
  dayTextFrom: string | null;
  offDayTo: string | null;
  dayTextTo: string | null;
  remarks: string | null;
  responseSuccess: boolean | null;
  responseMessage: string | null;
}

export interface ExtendedAppointmentDto {
  result: AppointmentDto[];
  count?: number;
}

export interface AppointmentInputDto extends FullAuditedEntityDto<number> {
  appointmentSerial?: string;
  appointmentCode?: string;
  doctorScheduleId?: number;
  doctorProfileId?: number;
  doctorName?: string;
  doctorCode?: string;
  patientProfileId?: number;
  patientName?: string;
  patientCode?: string;
  consultancyType?: ConsultancyType;
  doctorChamberId?: number;
  doctorScheduleDaySessionId?: number;
  scheduleDayofWeek?: string;
  appointmentType?: AppointmentType;
  appointmentDate?: string;
  appointmentTime?: string;
  doctorFeesSetupId?: number;
  doctorFee?: number;
  agentFee?: number;
  platformFee?: number;
  vatFee?: number;
  totalAppointmentFee?: number;
  appointmentStatus?: AppointmentStatus;
  appointmentPaymentStatus?: AppointmentPaymentStatus;
  chamberPaymentType?: ChamberPaymentType;
  cancelledByEntityId?: number;
  cancelledByRole?: string;
  paymentTransactionId?: string;
  appointmentCreatorId?: number;
  appointmentCreatorCode?: string;
  appointmentCreatorRole?: string;
  isCousltationComplete?: boolean;
}

export interface CampaignDoctorDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  campaignId?: number;
  doctorName?: string;
  doctorTitle?: DoctorTitle;
  doctorTitleName?: string;
  isActive?: boolean;
  isOnline?: boolean;
  doctorDegrees: DoctorDegreeDto[];
  qualifications?: string;
  doctorSpecialization: DoctorSpecializationDto[];
  areaOfExperties?: string;
  profilePic?: string;
  displayInstantFeeAsPatient?: number;
  doctorFee?: number;
  doctorCode?: string;
}

export interface CampaignDto extends FullAuditedEntityDto<number> {
  title?: string;
  subTitle?: string;
  isActive?: boolean;
  selectedDoctor: CampaignDoctorDto[];
}

export interface CommonDiseaseDto extends FullAuditedEntityDto<number> {
  code?: string;
  name?: string;
  description?: string;
}

export interface DashboardDto {
  totalAppointment?: number;
  totalPatient?: number;
  totalFeeAmount?: number;
  totalPaidAmount?: number;
  doctorLoyaltypoints?: number;
}

export interface DashboardStateDto {
  todayAppointment?: number;
  todayPatient?: number;
  todayFeeAmount: number;
  todayPaidAmount?: number;
  todayConsulted: number;
  totalAppointment: number;
  totalPatient: number;
  totalNewAppointment?: number;
  totalFollowUpAppointment?: number;
}

export interface AppointmentStateDto {
  todayAppointment: number | null;
  todayPatient: number | null;
  todayFeeAmount: number | null;
  todayPaidAmount: number | null;
  todayConsulted: number | null;
  totalAppointment: number | null;
  totalNewAppointment: number | null;
  totalFollowUpAppointment: number | null;
}

export interface DataFilterModel {
  name?: string;
  consultancyType?: ConsultancyType;
  specialityId?: number;
  specializationId?: number;
  appointmentStatus?: AppointmentStatus;
  appointmentType?: AppointmentType;
  fromDate?: string;
  toDate?: string;
  isCurrentOnline?: boolean;
  isActive?: boolean;
  scheduleId?: number;
  day?: string;
  export?: boolean;
}

export interface DegreeDto extends FullAuditedEntityDto<number> {
  degreeName?: string;
  description?: string;
}

export interface DeleteUserDataDto {
  userName?: string;
}

export interface DiagonsticPackageDto extends FullAuditedEntityDto<number> {
  serviceProviderId?: number;
  serviceProviderName?: string;
  packageName?: string;
  packageDescription?: string;
  providerRate?: number;
  discountRate?: number;
  finalRate?: number;
}

export interface DiagonsticPackageTestDto extends FullAuditedEntityDto<number> {
  diagonsticPackageId?: number;
  diagonsticPackageName?: string;
  pathologyCategoryId?: number;
  pathologyCategoryName?: string;
  pathologyTestId?: number;
  pathologyTestName?: string;
}

export interface DiagonsticPathologyServiceManagementDto
  extends FullAuditedEntityDto<number> {
  serviceRequestCode?: string;
  serviceProviderId?: number;
  serviceProviderName?: string;
  diagonsticServiceType?: DiagonsticServiceType;
  diagonsticServiceTypeName?: string;
  diagonsticCategoryName?: string;
  diagonsticPackageId?: number;
  diagonsticPackageName?: string;
  organizationCode?: string;
  patientProfileId?: number;
  patientName?: string;
  patientCode?: string;
  requestDate?: string;
  appointmentDate?: string;
  providerFee?: number;
  discount?: number;
  finalFee?: number;
  serviceRequestStatus?: ServiceRequestStatus;
  serviceRequestStatusName?: string;
  diagonsticTestRequested: DiagonsticTestRequestedDto[];
}

export interface DiagonsticTestDto extends FullAuditedEntityDto<number> {
  serviceProviderId?: number;
  serviceProviderName?: string;
  pathologyCategoryId?: number;
  pathologyCategoryName?: string;
  pathologyTestId?: number;
  pathologyTestName?: string;
  providerRate?: number;
  totalProviderRate?: number;
  discountRate?: number;
  finalRate?: number;
}

export interface DiagonsticTestRequestedDto
  extends FullAuditedEntityDto<number> {
  diagonsticPathologyServiceManagementId?: number;
  diagonsticTestId?: number;
  diagonsticTestName?: string;
  pathologyCategoryAndTest?: string;
  providerRate?: number;
}

export interface DoctorChamberDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  chamberName?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  isVisibleOnPrescription?: boolean;
}

export interface DoctorDegreeDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  doctorName?: string;
  degreeId?: number;
  degreeName?: string;
  duration?: number;
  durationType?: string;
  passingYear?: number;
  instituteName?: string;
  instituteCity?: string;
  zipCode?: string;
  instituteCountry?: string;
  isPrescriptionShow?: boolean;
}

export interface DoctorFeesSetupDto extends FullAuditedEntityDto<number> {
  doctorScheduleId?: number;
  doctorScheduleName?: string;
  appointmentType?: AppointmentType;
  appointmentTypeName?: string;
  currentFee?: number;
  previousFee?: number;
  feeAppliedFrom?: string;
  followUpPeriod?: number;
  reportShowPeriod?: number;
  discount?: number;
  discountAppliedFrom?: string;
  discountPeriod?: number;
  totalFee?: number;
  isActive?: boolean;
  responseSuccess?: boolean;
  responseMessage?: string;
}

export interface DoctorFeesSetupInputDto extends FullAuditedEntityDto<number> {
  doctorScheduleId?: number;
  appointmentType?: AppointmentType;
  currentFee?: number;
  previousFee?: number;
  feeAppliedFrom?: string;
  followUpPeriod?: number;
  reportShowPeriod?: number;
  discount?: number;
  discountAppliedFrom?: string;
  discountPeriod?: number;
  totalFee?: number;
  isActive?: boolean;
}

export interface DoctorProfileDto extends FullAuditedEntityDto<number> {
  doctorCode?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  doctorTitle?: DoctorTitle;
  doctorTitleName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  genderName?: string;
  maritalStatus?: MaritalStatus;
  maritalStatusName?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  mobileNo?: string;
  email?: string;
  identityNumber?: string;
  bmdcRegNo?: string;
  bmdcRegExpiryDate?: string;
  degrees: DoctorDegreeDto[];
  qualifications?: string;
  specialityId?: number;
  specialityName?: string;
  doctorSpecialization: DoctorSpecializationDto[];
  areaOfExperties?: string;
  isIdFileUploaded?: boolean;
  isSpecialityFileUploaded?: boolean;
  isActive?: boolean;
  userId?: string;
  isOnline?: boolean;
  profileStep: number;
  createFrom?: string;
  profileRole?: string;
  profilePic?: string;
  displayInstantFeeAsPatient?: number;
  displayInstantFeeAsAgent?: number;
  displayScheduledPatientChamberFee?: number;
  displayScheduledPatientOnlineFee?: number;
  displayScheduledAgentChamberFee?: number;
  displayScheduledAgentOnlineFee?: number;
  displayIndividualInstantOnlineFee?: number;
  expertise?: string;
}

export interface DoctorScheduleDaySessionDto
  extends FullAuditedEntityDto<number> {
  doctorScheduleId?: number;
  doctorScheduleName?: string;
  scheduleDayofWeek?: string;
  startTime?: string;
  endTime?: string;
  noOfPatients?: number;
  isActive?: boolean;
}

export interface DoctorScheduleDaySessionInputDto
  extends FullAuditedEntityDto<number> {
  doctorScheduleId?: number;
  scheduleDayofWeek?: string;
  startTime?: string;
  endTime?: string;
  noOfPatients?: number;
  isActive?: boolean;
}

export interface DoctorScheduleDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  doctorName?: string;
  scheduleType?: ScheduleType;
  scheduleTypeName?: string;
  consultancyType?: ConsultancyType;
  consultancyTypeName?: string;
  doctorChamberId?: number;
  chamber?: string;
  isActive?: boolean;
  status?: string;
  offDayFrom?: string;
  dayTextFrom?: string;
  offDayTo?: string;
  dayTextTo?: string;
  remarks?: string;
  doctorScheduleDaySession: DoctorScheduleDaySessionDto[];
  doctorFeesSetup: DoctorFeesSetupDto[];
  appointments: AppointmentDto[];
  scheduleName?: string;
  responseSuccess?: boolean;
  responseMessage?: string;
}

export interface DoctorScheduleInputDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  scheduleType?: ScheduleType;
  consultancyType?: ConsultancyType;
  doctorChamberId?: number;
  isActive?: boolean;
  offDayFrom?: string | null;
  offDayTo?: string | null;
  doctorScheduleDaySession: DoctorScheduleDaySessionInputDto[];
  doctorFeesSetup: DoctorFeesSetupInputDto[];
  scheduleName?: string;
  
}

export interface DoctorSpecializationDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  doctorName?: string;
  specialityId?: number;
  specialityName?: string;
  specializationId?: number;
  specializationName?: string;
  serviceDetails?: string;
  documentName?: string;
}

export interface DocumentsAttachmentDto extends FullAuditedEntityDto<number> {
  fileName?: string;
  originalFileName?: string;
  path?: string;
  entityType?: EntityType;
  entityTypeName?: string;
  entityId?: number;
  attachmentType?: AttachmentType;
  attachmentTypeName?: string;
  relatedEntityid?: number;
}

export interface DrugRxDto extends FullAuditedEntityDto<number> {
  tradeName?: string;
  brandName?: string;
  productName?: string;
  genericName?: string;
  dosageForm?: string;
  strength?: string;
  inclusionDate?: string;
  vlidUpto?: string;
  manufacturer?: string;
  dar?: string;
  cdar?: string;
  sdar?: string;
  gdar?: string;
  prescribedDrugName?: string;
}

export interface EkPayInitDto {
  status?: string;
  message?: string;
  gatewayPageURL?: string;
}

export interface FilterModel {
  offset: number;
  limit: number;
  pageNo: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: string;
  isDesc: boolean;
}

export interface FinancialSetupDto extends FullAuditedEntityDto<number> {
  platformFacilityId?: number;
  facilityEntityType?: FacilityEntityType;
  facilityEntityTypeName?: string;
  diagonsticServiceType?: DiagonsticServiceType;
  agentMasterId?: number;
  campaignId?: number;
  diagonsticServiceTypeName?: string;
  facilityEntityID?: number;
  facilityEntityName?: string;
  facilityName?: string;
  amountIn?: string;
  amount?: number;
  externalAmountIn?: string;
  externalAmount?: number;
  providerAmount?: number;
  isActive?: boolean;
  vat?: number;
}

export interface JAccessToken {
  jwtToken?: string;
}

export interface LoginDto {
  userName?: string;
  email?: string;
  password?: string;
  rememberMe: boolean;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken?: string;
  userId: string;
  userName: string;
  userEmail: string;
  roleName: string[];
  success: boolean;
  message?: string;
  loginType:string
}

export interface MasterDoctorDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  agentMasterId?: number;
  doctorName?: string;
  doctorTitle?: DoctorTitle;
  doctorTitleName?: string;
  isActive?: boolean;
  isOnline?: boolean;
  doctorDegrees: DoctorDegreeDto[];
  qualifications?: string;
  doctorSpecialization: DoctorSpecializationDto[];
  areaOfExperties?: string;
  profilePic?: string;
  displayInstantFeeAsAgent?: number;
  doctorFee?: number;
  doctorCode?: string;
}

export interface NotificationDto extends FullAuditedEntityDto<number> {
  message?: string;
  transactionType?: string;
  creatorEntityId?: number;
  creatorName?: string;
  creatorRole?: string;
  createForName?: string;
  notifyToEntityId?: number;
  notifyToName?: string;
  notifyToRole?: string;
  noticeFromEntity?: string;
  noticeFromEntityId?: number;
}

export interface OtpDto extends FullAuditedEntityDto<number> {
  otpNo?: number;
  mobileNo?: string;
  otpStatus?: OtpStatus;
  maxAttempt?: number;
}

export interface OtpResultDto {
  otpSent?: boolean;
  isUserExists?: boolean;
  otp: number;
}

export interface PathologyCategoryDto extends FullAuditedEntityDto<number> {
  pathologyCategoryName?: string;
  pathologyCategoryDescription?: string;
}

export interface PathologyTestDto extends FullAuditedEntityDto<number> {
  pathologyCategoryId?: number;
  pathologyCategoryName?: string;
  pathologyTestName?: string;
  pathologyTestDescription?: string;
}

export interface PatientDetailsForServiceDto {
  userNmae?: string;
  role?: string;
  patientProfileId?: number;
  patientName?: string;
  patientCode?: string;
  success?: boolean;
  message?: string;
}

export interface PatientProfileDto extends FullAuditedEntityDto<number> {
  fullName?: string;
  isSelf?: boolean;
  patientName?: string;
  patientCode?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: Gender;
  genderName?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  mobileNo?: string;
  patientMobileNo?: string;
  email?: string;
  patientEmail?: string;
  createdBy?: string;
  cratorCode?: string;
  creatorRole?: string;
  creatorEntityId?: number;
  userId?: string;
  profileRole?: string;
  creatorName?: string;
  boothName?: string;
  agentMasterName?: string;
  agentSupervisorName?: string;
  isFirstTime?: boolean;
}

export interface PatientReturnDto {
  patientName?: string;
  patientCode?: string;
  age?: string;
  gender?: string;
  bloodGroup?: string;
  patientMobileNo?: string;
  createdBy?: string;
  cratorCode?: string;
  creatorRole?: string;
  creatorEntityId?: string;
  userId?: string;
  patientProfileId: number;
}

export interface PaymentHistoryDto extends EntityDto<number> {
  application_code?: string;
  status?: string;
  sessionkey?: string;
  tran_date?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  store_amount?: string;
  currency?: string;
  bank_tran_id?: string;
  card_type?: string;
  card_no?: string;
  card_issuer?: string;
  card_brand?: string;
  card_issuer_country?: string;
  card_issuer_country_code?: string;
  currency_type?: string;
  currency_amount?: string;
  currency_rate?: string;
  base_fair?: string;
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
  emi_instalment?: string;
  emi_amount?: string;
  emi_description?: string;
  emi_issuer?: string;
  account_details?: string;
  risk_title?: string;
  risk_level?: string;
  apiConnect?: string;
  validated_on?: string;
  gw_version?: string;
  failedreason?: string;
  error?: string;
  card_sub_brand?: string;
  subscription_id?: string;
}

export interface PaymentHistoryInputDto {
  id: number;
  application_code?: string;
  status?: string;
  sessionkey?: string;
  tran_date?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  store_amount?: string;
  currency?: string;
  bank_tran_id?: string;
  card_type?: string;
  card_no?: string;
  card_issuer?: string;
  card_brand?: string;
  card_issuer_country?: string;
  card_issuer_country_code?: string;
  currency_type?: string;
  currency_amount?: string;
  currency_rate?: string;
  base_fair?: string;
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
  emi_instalment?: string;
  emi_amount?: string;
  emi_description?: string;
  emi_issuer?: string;
  account_details?: string;
  risk_title?: string;
  risk_level?: string;
  apiConnect?: string;
  validated_on?: string;
  gw_version?: string;
  failedreason?: string;
  error?: string;
  card_sub_brand?: string;
  subscription_id?: string;
}

export interface PlatformFacilityDto extends FullAuditedEntityDto<number> {
  serviceName?: string;
  description?: string;
  slug?: string;
}

export interface PlatformFinancialSetupDto
  extends FullAuditedEntityDto<number> {
  platformServiceId?: number;
  platformServiceName?: string;
  amountIn?: string;
  feeAmount?: number;
  externalAmountIn?: string;
  externalFeeAmount?: number;
  isActive?: boolean;
}

export interface PlatformPackageDto extends FullAuditedEntityDto<number> {
  packageTitle?: string;
  packageName?: string;
  packageCode?: string;
  packageDescription?: string;
  packageFacilities: PlatformPackageFacilityDto[];
  facilityofPackage?: string;
  reason?: string;
  price?: number;
  packageProviderId?: number;
  doctorName?: string;
  doctorTitle?: DoctorTitle;
  doctorTitleName?: string;
  doctorDegrees: DoctorDegreeDto[];
  qualifications?: string;
  doctorSpecialization: DoctorSpecializationDto[];
  areaOfExperties?: string;
  profilePic?: string;
  doctorCode?: string;
  slug?: string;
}

export interface PlatformPackageFacilityDto
  extends FullAuditedEntityDto<number> {
  platformPackageId?: number;
  facilityName?: string;
}

export interface PlatformPackageManagementDto
  extends FullAuditedEntityDto<number> {
  packageRequestCode?: string;
  platformPackageId?: number;
  packageName?: string;
  patientProfileId?: number;
  patientName?: string;
  patientCode?: string;
  patientMobileNo?: string;
  doctorName?: string;
  requestDate?: string;
  appointmentDate?: string;
  packageFee?: number;
  appointmentStatus?: AppointmentStatus;
  appointmentPaymentStatus?: AppointmentPaymentStatus;
  paymentTransactionId?: string;
}

export interface PlatformServiceDto extends FullAuditedEntityDto<number> {
  serviceName?: string;
  serviceDescription?: string;
}

export interface PrescriptionDrugDetailsDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  prescriptionRefferenceCode?: string;
  drugRxId?: number;
  drugName?: string;
  drugDoseSchedule?: string;
  isDrugExceptional?: boolean;
  drugDoseScheduleDays?: string;
  duration?: string;
  instruction?: string;
}

export interface PrescriptionFindingsObservationsDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  prescriptionRefferenceCode?: string;
  observation?: string;
  comments?: string;
}

export interface PrescriptionMainComplaintDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  prescriptionRefferenceCode?: string;
  symptom?: string;
  duration?: string;
  condition?: string;
  problems?: string;
  physicianRecommendedAction?: string;
}

export interface PrescriptionMasterDto extends FullAuditedEntityDto<number> {
  refferenceCode?: string;
  appointmentId?: number;
  appointmentSerial?: string;
  appointmentCode?: string;
  doctorProfileId?: number;
  doctorName?: string;
  doctorTitle?: DoctorTitle;
  doctorSpecialization: DoctorSpecializationDto[];
  areaOfExperties?: string;
  doctorDegrees: DoctorDegreeDto[];
  qualifications?: string;
  doctorCode?: string;
  doctorBmdcRegNo?: string;
  specialityId?: number;
  doctorSpecilityName?: string;
  patientProfileId?: number;
  patientName?: string;
  patientCode?: string;
  patientAge?: number;
  patientBloodGroup?: string;
  patientAdditionalInfo?: string;
  consultancyType?: ConsultancyType;
  consultancyTypeName?: string;
  appointmentType?: AppointmentType;
  appointmentTypeName?: string;
  appointmentDate?: string;
  prescriptionDate?: string;
  patientLifeStyle?: string;
  reportShowDate?: string;
  followupDate?: string;
  advice?: string;
  prescriptionPatientDiseaseHistory: PrescriptionPatientDiseaseHistoryDto[];
  prescriptionMainComplaints: PrescriptionMainComplaintDto[];
  prescriptionFindingsObservations: PrescriptionFindingsObservationsDto[];
  prescriptionMedicalCheckups: PrescriptionMedicalCheckupsDto[];
  prescriptionDrugDetails: PrescriptionDrugDetailsDto[];
}

export interface PrescriptionMedicalCheckupsDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  prescriptionRefferenceCode?: string;
  testName?: string;
  comments?: string;
}

export interface PrescriptionPatientDiseaseHistoryDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  prescriptionRefferenceCode?: string;
  patientProfileId?: number;
  patientName?: string;
  commonDiseaseId?: number;
  diseaseName?: string;
}

export interface PromoCodeDto extends FullAuditedEntityDto<number> {
  promoCodeName?: string;
  discountAmountIn?: PromoType;
  discountAmountInName?: string;
  discountAmount?: number;
  validDate?: string;
  isActive?: boolean;
  maxCouponUsedByUser: number;
  maxCouponAmount: number;
}

export interface ResetPasswordInputDto {
  userId?: string;
  newPassword?: string;
}

export interface ResetPasswordRoleWiseInputDto extends ResetPasswordInputDto {
  role?: string;
}

export interface ResetPasswordResponseDto {
  userName?: string;
  name?: string;
  success?: boolean;
  message?: string;
}

export interface ResponseDto {
  id?: number;
  value?: string;
  success?: boolean;
  message?: string;
}
export interface BaseResponse<T> {
  results: T[];
  message: string;
  status: string;
  status_code: number;
  is_success: boolean;
}

export interface SendOtpResponseDto {
  otp: number;
  isActive?: boolean;
  success?: boolean;
  message?: string;
}

export interface ServiceProviderDto extends FullAuditedEntityDto<number> {
  platformFacilityId?: number;
  platformFacilityName?: string;
  providerOrganizationName?: string;
  organizationCode?: string;
  contactPerson?: string;
  contactPersonMobileNo?: string;
  contactPersonEmail?: string;
  branch?: string;
  address?: string;
  organizationPhoneNumber?: string;
  organizationAvailability?: string;
  isActive?: boolean;
}

export interface SessionWeekDayTimeSlotPatientCountDto {
  scheduleId?: number;
  sessionId?: number;
  weekDay?: string;
  startTime?: string;
  endTime?: string;
  patientCount?: number;
}

export interface SmsInfo {
  sms_status?: string;
  status_message?: string;
  sms_type?: string;
  msisdn?: string;
  sms_body?: string;
  csms_id?: string;
  reference_id?: string;
}

export interface SmsRequestParamDto {
  msisdn?: string;
  sms?: string;
  csmsId?: string;
}

export interface SmsResponseDto {
  status?: string;
  status_code?: string;
  error_message?: string;
  smsinfo: SmsInfo[];
}

export interface SpecialityDto extends FullAuditedEntityDto<number> {
  specialityName?: string;
  description?: string;
  specializations: SpecializationDto[];
}

export interface SpecializationDto extends FullAuditedEntityDto<number> {
  specialityId?: number;
  specialityName?: string;
  specializationName?: string;
  description?: string;
}

export interface SslCommerzInitDto {
  status?: string;
  failedreason?: string;
  gatewayPageURL?: string;
}

export interface TransactionValidationDto {
  message?: string;
  isValidTransaction?: boolean;
}

export interface UserDataDeleteRequestDto extends FullAuditedEntityDto<number> {
  fullName?: string;
  mobileNumber?: string;
  description?: string;
}

export interface UserInfoDto extends FullAuditedEntityDto<string> {
  tenantId?: string;
  userName?: string;
  name?: string;
  surname?: string;
  email?: string;
  emailConfirmed?: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  isActive?: boolean;
  lockoutEnabled?: boolean;
  lockoutEnd?: string;
  concurrencyStamp?: string;
}

export interface UserSignUpResultDto {
  userId?: string;
  userName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  success?: boolean;
  message: string[];
}
