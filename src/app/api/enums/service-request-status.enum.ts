import { mapEnumToOptions } from './enum-utils';

export enum ServiceRequestStatus {
  ReauestSubmited = 1,
  RequestRecieved = 2,
  RequestConfirmed = 3,
  ServiceRecieved = 4,
  Cancelled = 5,
}

export const serviceRequestStatusOptions = mapEnumToOptions(ServiceRequestStatus);
