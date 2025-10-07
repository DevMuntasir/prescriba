import { mapEnumToOptions } from '@abp/ng.core';

export enum AppointmentStatus {
  Pending = 1,
  Confirmed = 2,
  InProgress = 3,
  Completed = 4,
  Cancelled = 5,
  Failed = 6,
}

export const appointmentStatusOptions = mapEnumToOptions(AppointmentStatus);
