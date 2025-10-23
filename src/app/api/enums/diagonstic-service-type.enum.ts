import { mapEnumToOptions } from './enum-utils';

export enum DiagonsticServiceType {
  General = 1,
  Package = 2,
}

export const diagonsticServiceTypeOptions = mapEnumToOptions(DiagonsticServiceType);
