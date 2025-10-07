import { mapEnumToOptions } from '@abp/ng.core';

export enum ScheduleType {
  Regular = 1,
  Occasional = 2,
}

export const scheduleTypeOptions = mapEnumToOptions(ScheduleType);
