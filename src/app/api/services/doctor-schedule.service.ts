import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type { DoctorScheduleDto } from '../dto-models/models';

@Injectable({ providedIn: 'root' })
export class DoctorScheduleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

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
}
