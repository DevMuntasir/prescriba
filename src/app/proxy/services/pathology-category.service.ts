import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PathologyCategoryDto } from '../dto-models/models';
import type { PathologyCategoryInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PathologyCategoryService {
  apiName = 'Default';
  

  create = (input: PathologyCategoryInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PathologyCategoryDto>({
      method: 'POST',
      url: '/api/app/pathology-category',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PathologyCategoryDto>({
      method: 'GET',
      url: `/api/app/pathology-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PathologyCategoryDto[]>({
      method: 'GET',
      url: '/api/app/pathology-category',
    },
    { apiName: this.apiName,...config });
  

  update = (input: PathologyCategoryInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PathologyCategoryDto>({
      method: 'PUT',
      url: '/api/app/pathology-category',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
