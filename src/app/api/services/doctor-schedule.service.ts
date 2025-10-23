import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type {
  DoctorScheduleDto,
  DoctorScheduleInputDto,
} from '../dto-models/models';

@Injectable({ providedIn: 'root' })
export class DoctorScheduleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(input: DoctorScheduleInputDto): Observable<DoctorScheduleDto> {
    return this.http.post<DoctorScheduleDto>(
      `${this.baseUrl}/api/app/doctor-schedule`,
      input
    );
  }

  get(id: number): Observable<DoctorScheduleDto> {
    return this.http.get<DoctorScheduleDto>(
      `${this.baseUrl}/api/app/doctor-schedule/${id}`
    );
  }

  getListByDoctorIdList(doctorId: number): Observable<DoctorScheduleDto[]> {
    return this.http.get<DoctorScheduleDto[]>(
      `${this.baseUrl}/api/app/doctor-schedule/by-doctor-id-list/${doctorId}`
    );
  }

  update(
    id: number,
    input: DoctorScheduleInputDto
  ): Observable<DoctorScheduleDto> {
    return this.http.put<DoctorScheduleDto>(
      `${this.baseUrl}/api/app/doctor-schedule/${id}`,
      input
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/app/doctor-schedule/${id}`
    );
  }
}
