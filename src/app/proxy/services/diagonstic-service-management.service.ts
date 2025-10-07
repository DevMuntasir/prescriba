import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DiagonsticPathologyServiceManagementDto } from '../dto-models/models';
import type { ServiceRequestStatus } from '../enums/service-request-status.enum';
import type { DiagonsticPathologyServiceManagementInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class DiagonsticServiceManagementService {
  apiName = 'Default';
  

  create = (input: DiagonsticPathologyServiceManagementInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPathologyServiceManagementDto>({
      method: 'POST',
      url: '/api/app/diagonstic-service-management',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPathologyServiceManagementDto>({
      method: 'GET',
      url: `/api/app/diagonstic-service-management/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPathologyServiceManagementDto[]>({
      method: 'GET',
      url: '/api/app/diagonstic-service-management',
    },
    { apiName: this.apiName,...config });
  

  update = (input: DiagonsticPathologyServiceManagementInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPathologyServiceManagementDto>({
      method: 'PUT',
      url: '/api/app/diagonstic-service-management',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updateServiceRequestStatusByAdminByIdAndServiceRequestStatus = (Id: number, serviceRequestStatus: ServiceRequestStatus, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DiagonsticPathologyServiceManagementDto>({
      method: 'PUT',
      url: `/api/app/diagonstic-service-management/service-request-status-by-admin/${Id}`,
      params: { serviceRequestStatus },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
