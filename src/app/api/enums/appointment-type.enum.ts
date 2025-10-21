import { mapEnumToOptions } from './enum-utils';

export enum AppointmentType {
  New = 1,
  Followup = 2,
  ReportShow = 3,
  Emargency = 4,
}

export const appointmentTypeOptions = mapEnumToOptions(AppointmentType);
