import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { FileDeleteInputDto } from '../input-dto/models';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  apiName = 'Default';
  

  deleteDoc = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'DELETE',
      url: '/api/Common/DeleteDoc',
      params: { id },
    },
    { apiName: this.apiName,...config });
  

  deleteFileAllotmentByInput = (input: FileDeleteInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Common/DeleteFileAllotment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  deleteFileComplainByInput = (input: FileDeleteInputDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Common/DeleteFileComplain',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  fileUploadDocuments = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/Common/Documents',
    },
    { apiName: this.apiName,...config });
  

  getDocument = (entityType: string, entityId: number, attachmentType: string, fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: '/api/Common/GetDocument',
      params: { entityType, entityId, attachmentType, fileName },
    },
    { apiName: this.apiName,...config });
  

  getDocumentId = (entityType: string, entityId: number, attachmentType: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number>({
      method: 'GET',
      url: '/api/Common/GetDocumentId',
      params: { entityType, entityId, attachmentType },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
