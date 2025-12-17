import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL, PRESCRIPTION_API_BASE_URL } from '../api-urls';
import { ApiResponse } from '../core/generic-models';
import type { AppointmentDto, DoctorScheduleDaySessionDto } from '../dto-models/models';

export interface AppointmentPatientQuery {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}


export interface AppointmentListQuery {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sessionId?: number;
  scheduleId?: number;
}

export interface CreateAppointmentPayload {
  patientName: string;
  gender: string;
  age: string;
  phoneNumber: string;
  sessionId: number;
  bloodGroup: string;
  scheduleId: number;
  appointmentDate: string;
  doctorProfileId: number;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;
  private readonly prescriptionBaseUrl = PRESCRIPTION_API_BASE_URL;

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

  getAppointmentById(id: number): Observable<ApiResponse<AppointmentDto>> {
    return this.http.get<ApiResponse<AppointmentDto>>(
      `${this.prescriptionBaseUrl}/api/2025-20/appointment/get-by-id?id=${id}`
    );
  }
  
  getAppointmentSessionList(): Observable<ApiResponse<DoctorScheduleDaySessionDto[]>> {
    return this.http.get<ApiResponse<DoctorScheduleDaySessionDto[]>>(
      `${this.baseUrl}/api/app/doctor-schedule-day-session/session-list`
    );
  }
  getAppointments(
    doctorProfileId: number,
    query?: AppointmentListQuery
  ): Observable<ApiResponse<AppointmentDto[]>> {
    let params = new HttpParams().set('doctorId', String(doctorProfileId));

    if (query?.pageNumber !== undefined) {
      params = params.set('pageNumber', String(query.pageNumber));
    }

    if (query?.pageSize !== undefined) {
      params = params.set('pageSize', String(query.pageSize));
    }

    if (query?.search) {
      params = params.set('search', query.search);
    }

    if (query?.sessionId !== undefined) {
      params = params.set('sessionId', String(query.sessionId));
    }

    if (query?.scheduleId !== undefined) {
      params = params.set('scheduleId', String(query.scheduleId));
    }

    return this.http.get<ApiResponse<AppointmentDto[]>>(
      `${this.prescriptionBaseUrl}/api/2025-20/appointment/appointment-get-by-doctorId`,
      { params }
    );
  }
  createAppointment(
    payload: CreateAppointmentPayload
  ): Observable<AppointmentDto> {
    return this.http.post<AppointmentDto>(
      `${this.prescriptionBaseUrl}/api/2025-20/appointment/create_appointment`,
      payload
    );
  }
}
