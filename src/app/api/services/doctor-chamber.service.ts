import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type { DoctorChamberDto } from '../dto-models/models';
import type { DoctorChamberInputDto } from '../input-dto/models';

@Injectable({ providedIn: 'root' })
export class DoctorChamberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(input: DoctorChamberInputDto): Observable<DoctorChamberDto> {
    return this.http.post<DoctorChamberDto>(
      `${this.baseUrl}/api/app/doctor-chamber`,
      input
    );
  }

  update(
    id: number,
    input: DoctorChamberInputDto
  ): Observable<DoctorChamberDto> {
    return this.http.put<DoctorChamberDto>(
      `${this.baseUrl}/api/app/doctor-chamber/${id}`,
      input
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/app/doctor-chamber/${id}`
    );
  }

  get(id: number): Observable<DoctorChamberDto> {
    return this.http.get<DoctorChamberDto>(
      `${this.baseUrl}/api/app/doctor-chamber/${id}`
    );
  }

  getListByDoctorId(doctorProfileId: number): Observable<DoctorChamberDto[]> {
    return this.http.get<DoctorChamberDto[]>(
      `${this.baseUrl}/api/app/doctor-chamber/by-doctor/${doctorProfileId}`
    );
  }
}
