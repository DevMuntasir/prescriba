import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PathologyTestDto } from '../dto-models/models';
import type { PathologyTestInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PathologyTestService {
  apiName = 'Default';
  

  create = (input: PathologyTestInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PathologyTestDto>({
      method: 'POST',
      url: '/api/app/pathology-test',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PathologyTestDto>({
      method: 'GET',
      url: `/api/app/pathology-test/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PathologyTestDto[]>({
      method: 'GET',
      url: '/api/app/pathology-test',
    },
    { apiName: this.apiName,...config });
  

  getTestListByCategoryId = (categoryId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PathologyTestDto[]>({
      method: 'GET',
      url: `/api/app/pathology-test/test-list-by-category-id/${categoryId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: PathologyTestInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PathologyTestDto>({
      method: 'PUT',
      url: '/api/app/pathology-test',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
