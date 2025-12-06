import type { FullAuditedEntityDto } from '../models/base-entity';
import type { DiagonsticServiceType } from '../enums/diagonstic-service-type.enum';
import type { ServiceRequestStatus } from '../enums/service-request-status.enum';
import type { DoctorTitle } from '../enums/doctor-title.enum';
import type { Gender } from '../enums/gender.enum';
import type { MaritalStatus } from '../enums/marital-status.enum';
import type { FacilityEntityType } from '../enums/facility-entity-type.enum';
import type { AppointmentStatus } from '../enums/appointment-status.enum';
import type { AppointmentPaymentStatus } from '../enums/appointment-payment-status.enum';
import type { ConsultancyType } from '../enums/consultancy-type.enum';
import type { AppointmentType } from '../enums/appointment-type.enum';
import type { PromoType } from '../enums/promo-type.enum';

export interface AgentMasterInputDto extends FullAuditedEntityDto<number> {
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
  selectedDoctor: MasterDoctorInputDto[];
}

export interface AgentProfileInputDto extends FullAuditedEntityDto<number> {
  agentMasterId?: number;
  agentSupervisorId?: number;
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

export interface AgentSupervisorInputDto extends FullAuditedEntityDto<number> {
  agentMasterId?: number;
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
}

export interface CampaignDoctorInputDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  campaignId?: number;
}

export interface CampaignInputDto extends FullAuditedEntityDto<number> {
  title?: string;
  subTitle?: string;
  isActive?: boolean;
  selectedDoctor: CampaignDoctorInputDto[];
}

export interface DegreeInputDto extends FullAuditedEntityDto<number> {
  degreeName?: string;
  description?: string;
}

export interface DiagonsticPackageInputDto
  extends FullAuditedEntityDto<number> {
  serviceProviderId?: number;
  packageName?: string;
  packageDescription?: string;
  providerRate?: number;
}

export interface DiagonsticPackageTestInputDto
  extends FullAuditedEntityDto<number> {
  diagonsticPackageId?: number;
  pathologyCategoryId?: number;
  pathologyTestId?: number;
}

export interface DiagonsticPathologyServiceManagementInputDto
  extends FullAuditedEntityDto<number> {
  serviceRequestCode?: string;
  serviceProviderId?: number;
  diagonsticServiceType?: DiagonsticServiceType;
  diagonsticPackageId?: number;
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
  diagonsticTestRequested: DiagonsticTestRequestedInputDto[];
}

export interface DiagonsticTestInputDto extends FullAuditedEntityDto<number> {
  serviceProviderId?: number;
  pathologyCategoryId?: number;
  pathologyTestId?: number;
  providerRate?: number;
}

export interface DiagonsticTestRequestedInputDto
  extends FullAuditedEntityDto<number> {
  diagonsticPathologyServiceManagementId?: number;
  diagonsticTestId?: number;
  pathologyCategoryAndTest?: string;
  providerRate?: number;
}

export interface DoctorChamberInputDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  chamberName?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  divisionId?: number;
  divisionName?: string;
  districtId?: number;
  districtName?: string;
  isVisibleOnPrescription?: boolean;
}

export interface DoctorDegreeInputDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  degreeId?: number;
  duration?: number;
  durationType?: string;
  passingYear?: number;
  instituteName?: string;
  instituteCity?: string;
  zipCode?: string;
  instituteCountry?: string;
}

export interface DoctorProfileInputDto extends FullAuditedEntityDto<number> {
  doctorCode?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  doctorTitle?: DoctorTitle;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  mobileNo?: string;
  email?: string;
  identityNumber?: string;
  bmdcRegNo?: string;
  bmdcRegExpiryDate?: string;
  degrees: DoctorDegreeInputDto[];
  specialityId?: number;
  doctorSpecialization: DoctorSpecializationInputDto[];
  isIdFileUploaded?: boolean;
  isSpecialityFileUploaded?: boolean;
  isActive?: boolean;
  userId?: string;
  isOnline?: boolean;
  profileStep?: number;
  createFrom?: string;
  expertise?: string;
}

export interface DoctorSpecializationInputDto
  extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  specialityId?: number;
  specializationId?: number;
  serviceDetails?: string;
  documentName?: string;
}

export interface EkPayInputDto {
  applicationCode?: string;
  transactionId?: string;
  totalAmount?: string;
}

export interface FileDeleteInputDto {
  filePath?: string;
}

export interface FinancialSetupInputDto extends FullAuditedEntityDto<number> {
  platformFacilityId?: number;
  agentMasterId?: number;
  campaignId?: number;
  facilityEntityType?: FacilityEntityType;
  diagonsticServiceType?: DiagonsticServiceType;
  facilityEntityID?: number;
  amountIn?: string;
  amount?: number;
  externalAmountIn?: string;
  externalAmount?: number;
  providerAmount?: number;
  vat?: number;
  isActive?: boolean;
}

export interface MasterDoctorInputDto extends FullAuditedEntityDto<number> {
  doctorProfileId?: number;
  agentMasterId?: number;
}

export interface PathologyCategoryInputDto
  extends FullAuditedEntityDto<number> {
  pathologyCategoryName?: string;
  pathologyCategoryDescription?: string;
}

export interface PathologyTestInputDto extends FullAuditedEntityDto<number> {
  pathologyCategoryId?: number;
  pathologyTestName?: string;
  pathologyTestDescription?: string;
}

export interface PatientProfileInputDto extends FullAuditedEntityDto<number> {
  fullName?: string;
  isSelf?: boolean;
  patientName?: string;
  patientCode?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: Gender;
  genderName?: Gender;
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
  creatorCode?: string;
  creatorRole?: string;
  creatorEntityId?: number;
  userId?: string;
  isFirstTime?: boolean;
  patientAge?: string;
}

export interface PaymentHistoryMobileInputDto {
  applicationCode?: string;
  transactionId?: string;
  totalAmount?: string;
  sessionKey?: string;
  status?: string;
  failedReason?: string;
}

export interface PlatformFacilityInputDto extends FullAuditedEntityDto<number> {
  serviceName?: string;
  description?: string;
  slug?: string;
}

export interface PlatformFinancialSetupInputDto
  extends FullAuditedEntityDto<number> {
  platformServiceId?: number;
  amountIn?: string;
  feeAmount?: number;
  externalAmountIn?: string;
  externalFeeAmount?: number;
  isActive?: boolean;
}

export interface PlatformPackageFacilityInputDto
  extends FullAuditedEntityDto<number> {
  platformPackageId?: number;
  facilityName?: string;
}

export interface PlatformPackageInputDto extends FullAuditedEntityDto<number> {
  packageTitle?: string;
  packageName?: string;
  packageCode?: string;
  packageDescription?: string;
  packageFacilities: PlatformPackageFacilityInputDto[];
  reason?: string;
  price?: number;
  packageProviderId?: number;
}

export interface PlatformPackageManagementInputDto
  extends FullAuditedEntityDto<number> {
  packageRequestCode?: string;
  platformPackageId?: number;
  patientProfileId?: number;
  requestDate?: string;
  appointmentDate?: string;
  packageFee?: number;
  appointmentStatus?: AppointmentStatus;
  appointmentPaymentStatus?: AppointmentPaymentStatus;
  paymentTransactionId?: string;
}

export interface PlatformServiceInputDto extends FullAuditedEntityDto<number> {
  serviceName?: string;
  serviceDescription?: string;
}

export interface PrescriptionDrugDetailsInputDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  drugRxId?: number;
  drugName?: string;
  drugDoseSchedule?: string;
  isDrugExceptional?: boolean;
  drugDoseScheduleDays?: string;
  duration?: string;
  instruction?: string;
}

export interface PrescriptionFindingsObservationsInputDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  observation?: string;
  comments?: string;
}

export interface PrescriptionMainComplaintInputDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  symptom?: string;
  duration?: string;
  condition?: string;
  problems?: string;
  physicianRecommendedAction?: string;
}

export interface PrescriptionMasterInputDto
  extends FullAuditedEntityDto<number> {
  refferenceCode?: string;
  appointmentId?: number;
  appointmentSerial?: string;
  appointmentCode?: string;
  doctorProfileId?: number;
  doctorName?: string;
  doctorCode?: string;
  patientProfileId?: number;
  patientName?: string;
  patientCode?: string;
  age?: number;
  patientAdditionalInfo?: string;
  consultancyType?: ConsultancyType;
  appointmentType?: AppointmentType;
  appointmentDate?: string;
  prescriptionDate?: string;
  patientLifeStyle?: string;
  reportShowDate?: string;
  followupDate?: string;
  advice?: string;
  prescriptionPatientDiseaseHistory: PrescriptionPatientDiseaseHistoryInputDto[];
  prescriptionMainComplaints: PrescriptionMainComplaintInputDto[];
  prescriptionFindingsObservations: PrescriptionFindingsObservationsInputDto[];
  prescriptionMedicalCheckups: PrescriptionMedicalCheckupsInputDto[];
  prescriptionDrugDetails: PrescriptionDrugDetailsInputDto[];
}

export interface PrescriptionMedicalCheckupsInputDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  testName?: string;
  comments?: string;
}

export interface PrescriptionPatientDiseaseHistoryInputDto
  extends FullAuditedEntityDto<number> {
  prescriptionMasterId?: number;
  patientProfileId?: number;
  commonDiseaseId?: number;
  diseaseName?: string;
}

export interface PromoCodeInputDto extends FullAuditedEntityDto<number> {
  promoCodeName?: string;
  discountAmountIn?: PromoType;
  discountAmount?: number;
  validDate?: string;
  isActive?: boolean;
  maxCouponUsedByUser: number;
  maxCouponAmount: number;
}

export interface RefreshTokenInput {
  refreshToken?: string;
}

export interface RtcTokenBuilerDto {
  appid?: string;
  appCertificate?: string;
  chanelName?: string;
  uid: number;
}

export interface ServiceProviderInputDto extends FullAuditedEntityDto<number> {
  platformFacilityId?: number;
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

export interface SpecialityInputDto extends FullAuditedEntityDto<number> {
  specialityName?: string;
  description?: string;
  specializations: SpecializationInputDto[];
}

export interface SpecializationInputDto extends FullAuditedEntityDto<number> {
  specialityId?: number;
  specializationName?: string;
  description?: string;
}

export interface SslCommerzInputDto {
  applicationCode?: string;
  transactionId?: string;
  totalAmount?: string;
}

export interface UserDataDeleteRequestInputDto
  extends FullAuditedEntityDto<number> {
  fullName?: string;
  mobileNumber?: string;
  description?: string;
}

export interface VerifyAccessTokenInput {
  accessToken?: string;
}

export interface SendNotificationInputDto {
  targetUserName?: string;
  message?: string;
}

