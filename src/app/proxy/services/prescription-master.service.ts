import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PrescriptionMasterDto, PrescriptionPatientDiseaseHistoryDto } from '../dto-models/models';
import type { PrescriptionMasterInputDto } from '../input-dto/models';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionMasterService {
  apiName = 'Default';
  

  create = (input: PrescriptionMasterInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto>({
      method: 'POST',
      url: '/api/app/prescription-master',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto>({
      method: 'GET',
      url: `/api/app/prescription-master/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto[]>({
      method: 'GET',
      url: '/api/app/prescription-master',
    },
    { apiName: this.apiName,...config });
  

  getPatientDiseaseList = (patientId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionPatientDiseaseHistoryDto[]>({
      method: 'GET',
      url: `/api/app/prescription-master/patient-disease-list/${patientId}`,
    },
    { apiName: this.apiName,...config });
  

  getPrescription = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto>({
      method: 'GET',
      url: `/api/app/prescription-master/${id}/prescription`,
    },
    { apiName: this.apiName,...config });
  

  getPrescriptionByAppointmentId = (appointmentId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto>({
      method: 'GET',
      url: `/api/app/prescription-master/prescription-by-appointment-id/${appointmentId}`,
    },
    { apiName: this.apiName,...config });
  

  getPrescriptionCount = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: '/api/app/prescription-master/prescription-count',
    },
    { apiName: this.apiName,...config });
  

  getPrescriptionListByAppointmentCreatorId = (patientId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto[]>({
      method: 'GET',
      url: `/api/app/prescription-master/prescription-list-by-appointment-creator-id/${patientId}`,
    },
    { apiName: this.apiName,...config });
  

  getPrescriptionMasterListByDoctorId = (doctorId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto[]>({
      method: 'GET',
      url: `/api/app/prescription-master/prescription-master-list-by-doctor-id/${doctorId}`,
    },
    { apiName: this.apiName,...config });
  

  getPrescriptionMasterListByDoctorIdPatientId = (doctorId: number, patientId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto[]>({
      method: 'GET',
      url: '/api/app/prescription-master/prescription-master-list-by-doctor-id-patient-id',
      params: { doctorId, patientId },
    },
    { apiName: this.apiName,...config });
  

  getPrescriptionMasterListByPatientId = (patientId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto[]>({
      method: 'GET',
      url: `/api/app/prescription-master/prescription-master-list-by-patient-id/${patientId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (input: PrescriptionMasterInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PrescriptionMasterDto>({
      method: 'PUT',
      url: '/api/app/prescription-master',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
