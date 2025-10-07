import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { UserDataDeleteRequestDto } from '../dto-models/models';
import type { UserDataDeleteRequestInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class UserDataDeleteService {
  apiName = 'Default';
  

  create = (input: UserDataDeleteRequestInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserDataDeleteRequestDto>({
      method: 'POST',
      url: '/api/app/user-data-delete',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserDataDeleteRequestDto>({
      method: 'GET',
      url: `/api/app/user-data-delete/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserDataDeleteRequestDto[]>({
      method: 'GET',
      url: '/api/app/user-data-delete',
    },
    { apiName: this.apiName,...config });
  

  update = (input: UserDataDeleteRequestInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserDataDeleteRequestDto>({
      method: 'PUT',
      url: '/api/app/user-data-delete',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
