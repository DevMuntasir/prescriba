import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DataFilterModel, FilterModel, PatientProfileDto } from '../dto-models/models';
import type { PatientProfileInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PatientProfileService {
  apiName = 'Default';
  

  create = (input: PatientProfileInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto>({
      method: 'POST',
      url: '/api/app/patient-profile',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto>({
      method: 'GET',
      url: `/api/app/patient-profile/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByPhoneAndCode = (pCode: string, pPhone: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto>({
      method: 'GET',
      url: '/api/app/patient-profile/by-phone-and-code',
      params: { pCode, pPhone },
    },
    { apiName: this.apiName,...config });
  

  getByUserId = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto>({
      method: 'GET',
      url: `/api/app/patient-profile/by-user-id/${userId}`,
    },
    { apiName: this.apiName,...config });
  

  getByUserName = (userName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto>({
      method: 'GET',
      url: '/api/app/patient-profile/by-user-name',
      params: { userName },
    },
    { apiName: this.apiName,...config });
  

  getDoctorListByCreatorIdFilter = (profileId: number, patientFilterModel: DataFilterModel, filterModel: FilterModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto[]>({
      method: 'GET',
      url: `/api/app/patient-profile/doctor-list-by-creator-id-filter/${profileId}`,
      params: { name: patientFilterModel.name, consultancyType: patientFilterModel.consultancyType, specialityId: patientFilterModel.specialityId, specializationId: patientFilterModel.specializationId, appointmentStatus: patientFilterModel.appointmentStatus, fromDate: patientFilterModel.fromDate, toDate: patientFilterModel.toDate, isCurrentOnline: patientFilterModel.isCurrentOnline, isActive: patientFilterModel.isActive, offset: filterModel.offset, limit: filterModel.limit, pageNo: filterModel.pageNo, pageSize: filterModel.pageSize, sortBy: filterModel.sortBy, sortOrder: filterModel.sortOrder, isDesc: filterModel.isDesc },
    },
    { apiName: this.apiName,...config });
  

  getDoctorListFilter = (patientFilterModel: DataFilterModel, filterModel: FilterModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto[]>({
      method: 'GET',
      url: '/api/app/patient-profile/doctor-list-filter',
      params: { name: patientFilterModel.name, consultancyType: patientFilterModel.consultancyType, specialityId: patientFilterModel.specialityId, specializationId: patientFilterModel.specializationId, appointmentStatus: patientFilterModel.appointmentStatus, fromDate: patientFilterModel.fromDate, toDate: patientFilterModel.toDate, isCurrentOnline: patientFilterModel.isCurrentOnline, isActive: patientFilterModel.isActive, offset: filterModel.offset, limit: filterModel.limit, pageNo: filterModel.pageNo, pageSize: filterModel.pageSize, sortBy: filterModel.sortBy, sortOrder: filterModel.sortOrder, isDesc: filterModel.isDesc },
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto[]>({
      method: 'GET',
      url: '/api/app/patient-profile',
    },
    { apiName: this.apiName,...config });
  

  getListPatientListByAdmin = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto[]>({
      method: 'GET',
      url: '/api/app/patient-profile/patient-list-by-admin',
    },
    { apiName: this.apiName,...config });
  

  getListPatientListByAgentMaster = (masterId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto[]>({
      method: 'GET',
      url: `/api/app/patient-profile/patient-list-by-agent-master/${masterId}`,
    },
    { apiName: this.apiName,...config });
  

  getListPatientListByAgentSuperVisor = (supervisorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto[]>({
      method: 'GET',
      url: `/api/app/patient-profile/patient-list-by-agent-super-visor/${supervisorId}`,
    },
    { apiName: this.apiName,...config });
  

  getPatientListBySearchUserProfileId = (profileId: number, role: string, name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto[]>({
      method: 'GET',
      url: `/api/app/patient-profile/patient-list-by-search-user-profile-id/${profileId}`,
      params: { role, name },
    },
    { apiName: this.apiName,...config });
  

  getPatientListByUserProfileId = (profileId: number, role: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto[]>({
      method: 'GET',
      url: `/api/app/patient-profile/patient-list-by-user-profile-id/${profileId}`,
      params: { role },
    },
    { apiName: this.apiName,...config });
  

  getPatientListFilterByAdmin = (userId: number, role: string, patientFilterModel: DataFilterModel, filterModel: FilterModel, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto[]>({
      method: 'GET',
      url: `/api/app/patient-profile/patient-list-filter-by-admin/${userId}`,
      params: { role, name: patientFilterModel.name, consultancyType: patientFilterModel.consultancyType, specialityId: patientFilterModel.specialityId, specializationId: patientFilterModel.specializationId, appointmentStatus: patientFilterModel.appointmentStatus, fromDate: patientFilterModel.fromDate, toDate: patientFilterModel.toDate, isCurrentOnline: patientFilterModel.isCurrentOnline, isActive: patientFilterModel.isActive, offset: filterModel.offset, limit: filterModel.limit, pageNo: filterModel.pageNo, pageSize: filterModel.pageSize, sortBy: filterModel.sortBy, sortOrder: filterModel.sortOrder, isDesc: filterModel.isDesc },
    },
    { apiName: this.apiName,...config });
  

  update = (input: PatientProfileInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PatientProfileDto>({
      method: 'PUT',
      url: '/api/app/patient-profile',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
