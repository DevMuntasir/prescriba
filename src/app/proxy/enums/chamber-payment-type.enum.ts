import { mapEnumToOptions } from '@abp/ng.core';

export enum ChamberPaymentType {
  payNow = 1,
  payAtChamber = 2,
}

export const chamberPaymentTypeOptions = mapEnumToOptions(ChamberPaymentType);
