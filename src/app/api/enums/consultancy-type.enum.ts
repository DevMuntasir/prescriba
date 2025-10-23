import { mapEnumToOptions } from './enum-utils';

export enum ConsultancyType {
  Chamber = 1,
  Online = 2,
  Instant = 5,
}

export const consultancyTypeOptions = mapEnumToOptions(ConsultancyType);
