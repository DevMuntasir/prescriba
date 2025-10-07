import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { AgentMasterDto, DataFilterModel, FilterModel } from '../dto-models/models';
import type { AgentMasterInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class AgentMasterService {
  apiName = 'Default';
  

  create = (input: AgentMasterInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentMasterDto>({
      method: 'POST',
      url: '/api/app/agent-master',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentMasterDto>({
      method: 'GET',
      url: `/api/app/agent-master/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAgentMasterListFilterByAdmin = (masterFilterModel: DataFilterModel, filterModel: FilterModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentMasterDto[]>({
      method: 'GET',
      url: '/api/app/agent-master/agent-master-list-filter-by-admin',
      params: { name: masterFilterModel.name, consultancyType: masterFilterModel.consultancyType, specialityId: masterFilterModel.specialityId, specializationId: masterFilterModel.specializationId, appointmentStatus: masterFilterModel.appointmentStatus, fromDate: masterFilterModel.fromDate, toDate: masterFilterModel.toDate, isCurrentOnline: masterFilterModel.isCurrentOnline, isActive: masterFilterModel.isActive, offset: filterModel.offset, limit: filterModel.limit, pageNo: filterModel.pageNo, pageSize: filterModel.pageSize, sortBy: filterModel.sortBy, sortOrder: filterModel.sortOrder, isDesc: filterModel.isDesc },
    },
    { apiName: this.apiName,...config });
  

  getAllAgentMasterList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentMasterDto[]>({
      method: 'GET',
      url: '/api/app/agent-master/agent-master-list',
    },
    { apiName: this.apiName,...config });
  

  getByUserName = (userName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentMasterDto>({
      method: 'GET',
      url: '/api/app/agent-master/by-user-name',
      params: { userName },
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentMasterDto[]>({
      method: 'GET',
      url: '/api/app/agent-master',
    },
    { apiName: this.apiName,...config });
  

  update = (input: AgentMasterInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentMasterDto>({
      method: 'PUT',
      url: '/api/app/agent-master',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
