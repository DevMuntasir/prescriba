import type { DoctorTitle } from '../../../../enums/doctor-title.enum';
import type { Gender } from '../../../../enums/gender.enum';
import type { MaritalStatus } from '../../../../enums/marital-status.enum';

export interface DoctorProfileResponseDto {
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
  specialityId?: number;
  isIdFileUploaded?: boolean;
  isSpecialityFileUploaded?: boolean;
  isActive?: boolean;
  userId?: string;
  isOnline?: boolean;
  profileStep?: number;
  createFrom?: string;
  expertise?: string;
}
