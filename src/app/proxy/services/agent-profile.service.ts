import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { AgentProfileDto, DataFilterModel, FilterModel } from '../dto-models/models';
import type { AgentProfileInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class AgentProfileService {
  apiName = 'Default';
  

  create = (input: AgentProfileInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto>({
      method: 'POST',
      url: '/api/app/agent-profile',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto>({
      method: 'GET',
      url: `/api/app/agent-profile/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getAgentListFilterByAdmin = (agentFilterModel: DataFilterModel, filterModel: FilterModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto[]>({
      method: 'GET',
      url: '/api/app/agent-profile/agent-list-filter-by-admin',
      params: { name: agentFilterModel.name, consultancyType: agentFilterModel.consultancyType, specialityId: agentFilterModel.specialityId, specializationId: agentFilterModel.specializationId, appointmentStatus: agentFilterModel.appointmentStatus, fromDate: agentFilterModel.fromDate, toDate: agentFilterModel.toDate, isCurrentOnline: agentFilterModel.isCurrentOnline, isActive: agentFilterModel.isActive, offset: filterModel.offset, limit: filterModel.limit, pageNo: filterModel.pageNo, pageSize: filterModel.pageSize, sortBy: filterModel.sortBy, sortOrder: filterModel.sortOrder, isDesc: filterModel.isDesc },
    },
    { apiName: this.apiName,...config });
  

  getByUserId = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto>({
      method: 'GET',
      url: `/api/app/agent-profile/by-user-id/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  getByUserName = (userName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto>({
      method: 'GET',
      url: '/api/app/agent-profile/by-user-name',
      params: { userName },
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto[]>({
      method: 'GET',
      url: '/api/app/agent-profile',
    },
    { apiName: this.apiName,...config });
  

  getListByMasterId = (masterId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto[]>({
      method: 'GET',
      url: `/api/app/agent-profile/by-master-id/${masterId}`,
    },
    { apiName: this.apiName,...config });
  

  getListBySupervisorId = (supervisorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto[]>({
      method: 'GET',
      url: `/api/app/agent-profile/by-supervisor-id/${supervisorId}`,
    },
    { apiName: this.apiName,...config });
  

  getlByUserName = (userName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto>({
      method: 'GET',
      url: '/api/app/agent-profile/l-by-user-name',
      params: { userName },
    },
    { apiName: this.apiName,...config });
  

  update = (input: AgentProfileInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AgentProfileDto>({
      method: 'PUT',
      url: '/api/app/agent-profile',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
