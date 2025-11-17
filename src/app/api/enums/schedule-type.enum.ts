import { mapEnumToOptions } from './enum-utils';

export enum ScheduleType {
  Regular = 1,
  Occasional = 2,
}

export const scheduleTypeOptions = mapEnumToOptions(ScheduleType);
