import { mapEnumToOptions } from '@abp/ng.core';

export enum PromoType {
  Fix = 1,
  Percentage = 2,
  Flat = 3,
}

export const promoTypeOptions = mapEnumToOptions(PromoType);
