import { mapEnumToOptions } from '@abp/ng.core';

export enum OtpStatus {
  New = 0,
  Send = 1,
  Varified = 2,
  Cancel = 3,
  TimeExpired = 4,
}

export const otpStatusOptions = mapEnumToOptions(OtpStatus);
