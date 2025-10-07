import { mapEnumToOptions } from '@abp/ng.core';

export enum EntityType {
  Doctor = 1,
  Agent = 2,
  Patient = 3,
  Hospital = 4,
}

export const entityTypeOptions = mapEnumToOptions(EntityType);
