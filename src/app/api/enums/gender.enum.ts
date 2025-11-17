import { mapEnumToOptions } from './enum-utils';

export enum Gender {
  Male = 1,
  Female = 2,
  Others = 3,
}

export const genderOptions = mapEnumToOptions(Gender);
