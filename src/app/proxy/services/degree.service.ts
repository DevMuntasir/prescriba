import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DegreeDto } from '../dto-models/models';
import type { DegreeInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class DegreeService {
  apiName = 'Default';
  

  create = (input: DegreeInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DegreeDto>({
      method: 'POST',
      url: '/api/app/degree',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DegreeDto>({
      method: 'GET',
      url: `/api/app/degree/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DegreeDto[]>({
      method: 'GET',
      url: '/api/app/degree',
    },
    { apiName: this.apiName,...config });
  

  update = (input: DegreeInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DegreeDto>({
      method: 'PUT',
      url: '/api/app/degree',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
