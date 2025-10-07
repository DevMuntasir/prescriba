import { RestService, Rest } from '@abp/ng.core';
import type {
  PagedAndSortedResultRequestDto,
  PagedResultDto,
} from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { DocumentsAttachmentDto } from '../dto-models/models';

@Injectable({
  providedIn: 'root',
})
export class DocumentsAttachmentService {
  apiName = 'Default';

  create = (input: DocumentsAttachmentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DocumentsAttachmentDto>(
      {
        method: 'POST',
        url: '/api/app/documents-attachment',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/documents-attachment/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DocumentsAttachmentDto>(
      {
        method: 'GET',
        url: `/api/app/documents-attachment/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getAttachmentInfoByEntityTypeAndEntityIdAndAttachmentType = (
    entityType: string,
    entityId: number,
    attachmentType: string,
    relatedEntityid?: number,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DocumentsAttachmentDto[]>(
      {
        method: 'GET',
        url: `/api/app/documents-attachment/attachment-info/${entityId}`,
        params: { entityType, relatedEntityid, attachmentType },
      },
      { apiName: this.apiName, ...config }
    );

  getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType = (
    entityType: string,
    entityId: number,
    attachmentType: string,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DocumentsAttachmentDto>(
      {
        method: 'GET',
        url: `/api/app/documents-attachment/document-info/${entityId}`,
        params: { entityType, attachmentType },
      },
      { apiName: this.apiName, ...config }
    );

  getList = (
    input: PagedAndSortedResultRequestDto,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, PagedResultDto<DocumentsAttachmentDto>>(
      {
        method: 'GET',
        url: '/api/app/documents-attachment',
        params: {
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
        },
      },
      { apiName: this.apiName, ...config }
    );

  update = (
    id: number,
    input: DocumentsAttachmentDto,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, DocumentsAttachmentDto>(
      {
        method: 'PUT',
        url: `/api/app/documents-attachment/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
