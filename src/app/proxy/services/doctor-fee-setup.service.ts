import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type {
  DoctorFeesSetupDto,
  DoctorFeesSetupInputDto,
  ResponseDto,
} from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class DoctorFeeSetupService {
  apiName = 'Default';

  create = (input: DoctorFeesSetupInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseDto>(
      {
        method: 'POST',
        url: '/api/app/doctor-fee-setup',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  createFromMobileApp = (
    input: DoctorFeesSetupInputDto,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorFeesSetupDto>(
      {
        method: 'POST',
        url: '/api/app/doctor-fee-setup/from-mobile-app',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorFeesSetupDto>(
      {
        method: 'GET',
        url: `/api/app/doctor-fee-setup/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorFeesSetupDto[]>(
      {
        method: 'GET',
        url: '/api/app/doctor-fee-setup',
      },
      { apiName: this.apiName, ...config }
    );

  getListByDoctorIdList = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DoctorFeesSetupDto[]>(
      {
        method: 'GET',
        url: `/api/app/doctor-fee-setup/by-doctor-id-list/${doctorId}`,
      },
      { apiName: this.apiName, ...config }
    );

  update = (input: DoctorFeesSetupInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ResponseDto>(
      {
        method: 'PUT',
        url: '/api/app/doctor-fee-setup',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  updateFromMobileApp = (
    input: DoctorFeesSetupInputDto,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DoctorFeesSetupDto>(
      {
        method: 'PUT',
        url: '/api/app/doctor-fee-setup/from-mobile-app',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
