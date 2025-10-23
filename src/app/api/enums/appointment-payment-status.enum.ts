import { mapEnumToOptions } from './enum-utils';

export enum AppointmentPaymentStatus {
  Paid = 1,
  Due = 2,
  FailedOrCancelled = 3,
}

export const appointmentPaymentStatusOptions = mapEnumToOptions(AppointmentPaymentStatus);
