import { mapEnumToOptions } from '@abp/ng.core';

export enum ConsultancyType {
  Chamber = 1,
  Online = 2,
  Instant = 5,
}

export const consultancyTypeOptions = mapEnumToOptions(ConsultancyType);
