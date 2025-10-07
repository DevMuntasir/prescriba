import { mapEnumToOptions } from '@abp/ng.core';

export enum AttachmentType {
  ProfilePicture = 1,
  DoctorDegreeDoc = 2,
  DoctIdentityDoc = 3,
  DoctorSpecialityDoc = 4,
  Prescription = 5,
  PatientPreviousDocuments = 6,
  DoctorSign = 7,
}

export const attachmentTypeOptions = mapEnumToOptions(AttachmentType);
