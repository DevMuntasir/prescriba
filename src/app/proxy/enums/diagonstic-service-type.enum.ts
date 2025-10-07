import { mapEnumToOptions } from '@abp/ng.core';

export enum DiagonsticServiceType {
  General = 1,
  Package = 2,
}

export const diagonsticServiceTypeOptions = mapEnumToOptions(DiagonsticServiceType);
