import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { NotificationDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  apiName = 'Default';
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationDto>({
      method: 'GET',
      url: `/api/app/notification/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByUserIdCountByUserIdAndRole = (userId: number, role: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: `/api/app/notification/by-user-id-count/${userId}`,
      params: { role },
    },
    { apiName: this.apiName,...config });
  

  getCount = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: '/api/app/notification/count',
    },
    { apiName: this.apiName,...config });
  

  getCountByUserIdByUserIdAndRole = (userId: number, role: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: `/api/app/notification/count-by-user-id/${userId}`,
      params: { role },
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationDto[]>({
      method: 'GET',
      url: '/api/app/notification',
    },
    { apiName: this.apiName,...config });
  

  getListByUserId = (userId: number, role: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, NotificationDto[]>({
      method: 'GET',
      url: `/api/app/notification/by-user-id/${userId}`,
      params: { role },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
