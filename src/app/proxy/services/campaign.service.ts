import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CampaignDto } from '../dto-models/models';
import type { CampaignInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  apiName = 'Default';
  

  create = (input: CampaignInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDto>({
      method: 'POST',
      url: '/api/app/campaign',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDto>({
      method: 'GET',
      url: `/api/app/campaign/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDto[]>({
      method: 'GET',
      url: '/api/app/campaign',
    },
    { apiName: this.apiName,...config });
  

  update = (input: CampaignInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CampaignDto>({
      method: 'PUT',
      url: '/api/app/campaign',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
