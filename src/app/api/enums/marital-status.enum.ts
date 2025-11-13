import { mapEnumToOptions } from './enum-utils';

export enum MaritalStatus {
  Single = 1,
  Maried = 2,
}

export const maritalStatusOptions = mapEnumToOptions(MaritalStatus);
