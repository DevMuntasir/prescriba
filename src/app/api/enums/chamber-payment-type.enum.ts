import { mapEnumToOptions } from './enum-utils';

export enum ChamberPaymentType {
  payNow = 1,
  payAtChamber = 2,
}

export const chamberPaymentTypeOptions = mapEnumToOptions(ChamberPaymentType);
