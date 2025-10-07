import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type {
  DataFilterModel,
  DoctorProfileDto,
  FilterModel,
} from '../dto-models/models';
import type { DoctorProfileInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class DoctorProfileService {
  apiName = 'Default';

  create = (input: DoctorProfileInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'POST',
        url: '/api/app/doctor-profile',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'GET',
        url: `/api/app/doctor-profile/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getAllActiveDoctorList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto[]>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile/active-doctor-list',
      },
      { apiName: this.apiName, ...config }
    );

  getByUserId = (userId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'GET',
        url: `/api/app/doctor-profile/by-user-id/${userId}`,
      },
      { apiName: this.apiName, ...config }
    );

  getByUserName = (userName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile/by-user-name',
        params: { userName },
      },
      { apiName: this.apiName, ...config }
    );

  getCurrentlyOnlineDoctorList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto[]>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile/currently-online-doctor-list',
      },
      { apiName: this.apiName, ...config }
    );

  getDoctorByProfileId = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'GET',
        url: `/api/app/doctor-profile/${id}/doctor-by-profile-id`,
      },
      { apiName: this.apiName, ...config }
    );

  getDoctorDetailsByAdmin = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'GET',
        url: `/api/app/doctor-profile/${id}/doctor-details-by-admin`,
      },
      { apiName: this.apiName, ...config }
    );

  getDoctorListFilter = (
    doctorFilterModel: DataFilterModel,
    filterModel: FilterModel,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorProfileDto[]>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile/doctor-list-filter',
        params: {
          name: doctorFilterModel.name,
          consultancyType: doctorFilterModel.consultancyType,
          specialityId: doctorFilterModel.specialityId,
          specializationId: doctorFilterModel.specializationId,
          appointmentStatus: doctorFilterModel.appointmentStatus,
          fromDate: doctorFilterModel.fromDate,
          toDate: doctorFilterModel.toDate,
          isCurrentOnline: doctorFilterModel.isCurrentOnline,
          isActive: doctorFilterModel.isActive,
          offset: filterModel.offset,
          limit: filterModel.limit,
          pageNo: filterModel.pageNo,
          pageSize: filterModel.pageSize,
          sortBy: filterModel.sortBy,
          sortOrder: filterModel.sortOrder,
          isDesc: filterModel.isDesc,
        },
      },
      { apiName: this.apiName, ...config }
    );

  getDoctorListFilterByAdmin = (
    doctorFilterModel: DataFilterModel,
    filterModel: FilterModel,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorProfileDto[]>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile/doctor-list-filter-by-admin',
        params: {
          name: doctorFilterModel.name,
          consultancyType: doctorFilterModel.consultancyType,
          specialityId: doctorFilterModel.specialityId,
          specializationId: doctorFilterModel.specializationId,
          appointmentStatus: doctorFilterModel.appointmentStatus,
          fromDate: doctorFilterModel.fromDate,
          toDate: doctorFilterModel.toDate,
          isCurrentOnline: doctorFilterModel.isCurrentOnline,
          isActive: doctorFilterModel.isActive,
          offset: filterModel.offset,
          limit: filterModel.limit,
          pageNo: filterModel.pageNo,
          pageSize: filterModel.pageSize,
          sortBy: filterModel.sortBy,
          sortOrder: filterModel.sortOrder,
          isDesc: filterModel.isDesc,
        },
      },
      { apiName: this.apiName, ...config }
    );

  getDoctorListFilterMobileApp = (
    doctorFilterModel: DataFilterModel,
    filterModel: FilterModel,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorProfileDto[]>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile/doctor-list-filter-mobile-app',
        params: {
          name: doctorFilterModel.name,
          consultancyType: doctorFilterModel.consultancyType,
          specialityId: doctorFilterModel.specialityId,
          specializationId: doctorFilterModel.specializationId,
          appointmentStatus: doctorFilterModel.appointmentStatus,
          fromDate: doctorFilterModel.fromDate,
          toDate: doctorFilterModel.toDate,
          isCurrentOnline: doctorFilterModel.isCurrentOnline,
          isActive: doctorFilterModel.isActive,
          offset: filterModel.offset,
          limit: filterModel.limit,
          pageNo: filterModel.pageNo,
          pageSize: filterModel.pageSize,
          sortBy: filterModel.sortBy,
          sortOrder: filterModel.sortOrder,
          isDesc: filterModel.isDesc,
        },
      },
      { apiName: this.apiName, ...config }
    );

  getDoctorsCountByFilters = (
    doctorFilterModel: DataFilterModel,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, number>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile/doctors-count-by-filters',
        params: {
          name: doctorFilterModel.name,
          consultancyType: doctorFilterModel.consultancyType,
          specialityId: doctorFilterModel.specialityId,
          specializationId: doctorFilterModel.specializationId,
          appointmentStatus: doctorFilterModel.appointmentStatus,
          fromDate: doctorFilterModel.fromDate,
          toDate: doctorFilterModel.toDate,
          isCurrentOnline: doctorFilterModel.isCurrentOnline,
          isActive: doctorFilterModel.isActive,
        },
      },
      { apiName: this.apiName, ...config }
    );

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto[]>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile',
      },
      { apiName: this.apiName, ...config }
    );

  getListDoctorListByAdmin = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto[]>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile/doctor-list-by-admin',
      },
      { apiName: this.apiName, ...config }
    );

  getLiveOnlineDoctorList = (
    filterModel: FilterModel,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorProfileDto[]>(
      {
        method: 'GET',
        url: '/api/app/doctor-profile/live-online-doctor-list',
        params: {
          offset: filterModel.offset,
          limit: filterModel.limit,
          pageNo: filterModel.pageNo,
          pageSize: filterModel.pageSize,
          sortBy: filterModel.sortBy,
          sortOrder: filterModel.sortOrder,
          isDesc: filterModel.isDesc,
        },
      },
      { apiName: this.apiName, ...config }
    );

  update = (input: DoctorProfileInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'PUT',
        url: '/api/app/doctor-profile',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  updateActiveStatusByAdminByIdAndActiveStatus = (
    Id: number,
    activeStatus: boolean,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'PUT',
        url: `/api/app/doctor-profile/active-status-by-admin/${Id}`,
        params: { activeStatus },
      },
      { apiName: this.apiName, ...config }
    );

  updateDoctorProfile = (
    input: DoctorProfileInputDto,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'PUT',
        url: '/api/app/doctor-profile/doctor-profile',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  updateDoctorsOnlineStatusByIdAndOnlineStatus = (
    Id: number,
    onlineStatus: boolean,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'PUT',
        url: `/api/app/doctor-profile/doctors-online-status/${Id}`,
        params: { onlineStatus },
      },
      { apiName: this.apiName, ...config }
    );

  updateExpertiseByIdAndExpertise = (
    Id: number,
    expertise: string,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'PUT',
        url: `/api/app/doctor-profile/expertise/${Id}`,
        params: { expertise },
      },
      { apiName: this.apiName, ...config }
    );

  updateProfileStep = (
    profileId: number,
    step: number,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorProfileDto>(
      {
        method: 'PUT',
        url: `/api/app/doctor-profile/profile-step/${profileId}`,
        params: { step },
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
