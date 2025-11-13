import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type { DocumentsAttachmentDto } from '../dto-models/models';
import type {
  PagedAndSortedResultRequestDto,
  PagedResultDto,
} from '../models/base-entity';

@Injectable({ providedIn: 'root' })
export class DocumentsAttachmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(input: DocumentsAttachmentDto): Observable<DocumentsAttachmentDto> {
    return this.http.post<DocumentsAttachmentDto>(
      `${this.baseUrl}/api/app/documents-attachment`,
      input
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/app/documents-attachment/${id}`
    );
  }

  get(id: number): Observable<DocumentsAttachmentDto> {
    return this.http.get<DocumentsAttachmentDto>(
      `${this.baseUrl}/api/app/documents-attachment/${id}`
    );
  }

  getAttachmentInfoByEntityTypeAndEntityIdAndAttachmentType(
    entityType: string,
    entityId: number,
    attachmentType: string,
    relatedEntityid?: number
  ): Observable<DocumentsAttachmentDto[]> {
    let params = new HttpParams()
      .set('entityType', entityType)
      .set('attachmentType', attachmentType);

    if (relatedEntityid !== undefined && relatedEntityid !== null) {
      params = params.set('relatedEntityid', String(relatedEntityid));
    }

    return this.http.get<DocumentsAttachmentDto[]>(
      `${this.baseUrl}/api/app/documents-attachment/attachment-info/${entityId}`,
      { params }
    );
  }

  getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType(
    entityType: string,
    entityId: number,
    attachmentType: string
  ): Observable<DocumentsAttachmentDto> {
    const params = new HttpParams()
      .set('entityType', entityType)
      .set('attachmentType', attachmentType);

    return this.http.get<DocumentsAttachmentDto>(
      `${this.baseUrl}/api/app/documents-attachment/document-info/${entityId}`,
      { params }
    );
  }

  getList(
    input: PagedAndSortedResultRequestDto
  ): Observable<PagedResultDto<DocumentsAttachmentDto>> {
    let params = new HttpParams();

    if (input.sorting) {
      params = params.set('sorting', input.sorting);
    }
    if (input.skipCount !== undefined) {
      params = params.set('skipCount', String(input.skipCount));
    }
    if (input.maxResultCount !== undefined) {
      params = params.set('maxResultCount', String(input.maxResultCount));
    }

    return this.http.get<PagedResultDto<DocumentsAttachmentDto>>(
      `${this.baseUrl}/api/app/documents-attachment`,
      { params }
    );
  }

  update(
    id: number,
    input: DocumentsAttachmentDto
  ): Observable<DocumentsAttachmentDto> {
    return this.http.put<DocumentsAttachmentDto>(
      `${this.baseUrl}/api/app/documents-attachment/${id}`,
      input
    );
  }
}
