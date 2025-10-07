import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DiagonsticPackageTestDto } from '../dto-models/models';
import type { DiagonsticPackageTestInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class DiagonsticPackageTestService {
  apiName = 'Default';
  

  create = (input: DiagonsticPackageTestInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageTestDto>({
      method: 'POST',
      url: '/api/app/diagonstic-package-test',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageTestDto>({
      method: 'GET',
      url: `/api/app/diagonstic-package-test/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageTestDto[]>({
      method: 'GET',
      url: '/api/app/diagonstic-package-test',
    },
    { apiName: this.apiName,...config });
  

  getTestListByPackageId = (packageId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageTestDto[]>({
      method: 'GET',
      url: `/api/app/diagonstic-package-test/test-list-by-package-id/${packageId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: DiagonsticPackageTestInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPackageTestDto>({
      method: 'PUT',
      url: '/api/app/diagonstic-package-test',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
