import { mapEnumToOptions } from './enum-utils';

export enum PromoType {
  Fix = 1,
  Percentage = 2,
  Flat = 3,
}

export const promoTypeOptions = mapEnumToOptions(PromoType);
