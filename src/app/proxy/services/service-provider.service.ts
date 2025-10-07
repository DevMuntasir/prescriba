import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DataFilterModel, FilterModel, ServiceProviderDto } from '../dto-models/models';
import type { ServiceProviderInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderService {
  apiName = 'Default';
  

  create = (input: ServiceProviderInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ServiceProviderDto>({
      method: 'POST',
      url: '/api/app/service-provider',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ServiceProviderDto>({
      method: 'GET',
      url: `/api/app/service-provider/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBranchListByProviderName = (providerName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ServiceProviderDto[]>({
      method: 'GET',
      url: '/api/app/service-provider/branch-list-by-provider-name',
      params: { providerName },
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ServiceProviderDto[]>({
      method: 'GET',
      url: '/api/app/service-provider',
    },
    { apiName: this.apiName,...config });
  

  getListByFacilityId = (facilityId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ServiceProviderDto[]>({
      method: 'GET',
      url: `/api/app/service-provider/by-facility-id/${facilityId}`,
    },
    { apiName: this.apiName,...config });
  

  getListBySlug = (slug: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string[]>({
      method: 'GET',
      url: '/api/app/service-provider/by-slug',
      params: { slug },
    },
    { apiName: this.apiName,...config });
  

  getServiceProviderListFilterByAdmin = (providerFilterModel: DataFilterModel, filterModel: FilterModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ServiceProviderDto[]>({
      method: 'GET',
      url: '/api/app/service-provider/service-provider-list-filter-by-admin',
      params: { name: providerFilterModel.name, consultancyType: providerFilterModel.consultancyType, specialityId: providerFilterModel.specialityId, specializationId: providerFilterModel.specializationId, appointmentStatus: providerFilterModel.appointmentStatus, fromDate: providerFilterModel.fromDate, toDate: providerFilterModel.toDate, isCurrentOnline: providerFilterModel.isCurrentOnline, isActive: providerFilterModel.isActive, offset: filterModel.offset, limit: filterModel.limit, pageNo: filterModel.pageNo, pageSize: filterModel.pageSize, sortBy: filterModel.sortBy, sortOrder: filterModel.sortOrder, isDesc: filterModel.isDesc },
    },
    { apiName: this.apiName,...config });
  

  update = (input: ServiceProviderInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ServiceProviderDto>({
      method: 'PUT',
      url: '/api/app/service-provider',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
