import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import { ApiResponse } from '../core/generic-models';
import type { AppointmentDto } from '../dto-models/models';

export interface AppointmentPatientQuery {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  getPatientsByDoctorId(
    doctorId: number,
    query: AppointmentPatientQuery
  ): Observable<ApiResponse<AppointmentDto[]>> {
    let params = new HttpParams();

    if (query.searchTerm) {
      params = params.set('name', query.searchTerm);
    }
    if (query.pageNumber !== undefined) {
      params = params.set('pageNumber', String(query.pageNumber));
    }
    if (query.pageSize !== undefined) {
      params = params.set('pageSize', String(query.pageSize));
    }

    return this.http
      .get<ApiResponse<AppointmentDto[]> | AppointmentDto[]>(
        `${this.baseUrl}/api/app/appointment/patient-list-by-doctor-id/${doctorId}`,
        { params }
      )
      .pipe(
        map((response) => {
          if (Array.isArray(response)) {
            return {
              results: response,
              status_code: 200,
              is_success: true,
              message: undefined,
              status: undefined,
            } satisfies ApiResponse<AppointmentDto[]>;
          }

          return response;
        })
      );
  }
}
