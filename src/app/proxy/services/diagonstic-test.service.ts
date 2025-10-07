import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DataFilterModel, DiagonsticTestDto, FilterModel } from '../dto-models/models';
import type { DiagonsticTestInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class DiagonsticTestService {
  apiName = 'Default';
  

  create = (input: DiagonsticTestInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticTestDto>({
      method: 'POST',
      url: '/api/app/diagonstic-test',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticTestDto>({
      method: 'GET',
      url: `/api/app/diagonstic-test/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getDiagonsticTestListFilterByAdmin = (diagonsticTestFilterModel: DataFilterModel, filterModel: FilterModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticTestDto[]>({
      method: 'GET',
      url: '/api/app/diagonstic-test/diagonstic-test-list-filter-by-admin',
      params: { name: diagonsticTestFilterModel.name, consultancyType: diagonsticTestFilterModel.consultancyType, specialityId: diagonsticTestFilterModel.specialityId, specializationId: diagonsticTestFilterModel.specializationId, appointmentStatus: diagonsticTestFilterModel.appointmentStatus, fromDate: diagonsticTestFilterModel.fromDate, toDate: diagonsticTestFilterModel.toDate, isCurrentOnline: diagonsticTestFilterModel.isCurrentOnline, isActive: diagonsticTestFilterModel.isActive, offset: filterModel.offset, limit: filterModel.limit, pageNo: filterModel.pageNo, pageSize: filterModel.pageSize, sortBy: filterModel.sortBy, sortOrder: filterModel.sortOrder, isDesc: filterModel.isDesc },
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticTestDto[]>({
      method: 'GET',
      url: '/api/app/diagonstic-test',
    },
    { apiName: this.apiName,...config });
  

  getTestListByProviderId = (providerId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticTestDto[]>({
      method: 'GET',
      url: `/api/app/diagonstic-test/test-list-by-provider-id/${providerId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: DiagonsticTestInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticTestDto>({
      method: 'PUT',
      url: '/api/app/diagonstic-test',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
