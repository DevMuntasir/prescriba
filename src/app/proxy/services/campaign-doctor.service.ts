import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CampaignDoctorDto } from '../dto-models/models';
import type { CampaignDoctorInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class CampaignDoctorService {
  apiName = 'Default';
  

  create = (input: CampaignDoctorInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDoctorDto>({
      method: 'POST',
      url: '/api/app/campaign-doctor',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/campaign-doctor/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDoctorDto>({
      method: 'GET',
      url: `/api/app/campaign-doctor/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getCampaignDoctorListByCampaignId = (campaignId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDoctorDto[]>({
      method: 'GET',
      url: `/api/app/campaign-doctor/campaign-doctor-list-by-campaign-id/${campaignId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDoctorDto[]>({
      method: 'GET',
      url: '/api/app/campaign-doctor',
    },
    { apiName: this.apiName,...config });
  

  getListByDoctorId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDoctorDto[]>({
      method: 'GET',
      url: `/api/app/campaign-doctor/by-doctor-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: CampaignDoctorInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDoctorDto>({
      method: 'PUT',
      url: '/api/app/campaign-doctor',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
