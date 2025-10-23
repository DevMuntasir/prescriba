import { mapEnumToOptions } from './enum-utils';

export enum FacilityEntityType {
  DoctorConsultation = 1,
  ServiceFacility = 2,
}

export const facilityEntityTypeOptions = mapEnumToOptions(FacilityEntityType);
