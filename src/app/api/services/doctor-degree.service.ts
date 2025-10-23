import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type { DoctorDegreeDto } from '../dto-models/models';
import type { DoctorDegreeInputDto } from '../input-dto/models';

@Injectable({ providedIn: 'root' })
export class DoctorDegreeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(input: DoctorDegreeInputDto): Observable<DoctorDegreeDto> {
    return this.http.post<DoctorDegreeDto>(
      `${this.baseUrl}/api/app/doctor-degree`,
      input
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/app/doctor-degree/${id}`
    );
  }

  get(id: number): Observable<DoctorDegreeDto> {
    return this.http.get<DoctorDegreeDto>(
      `${this.baseUrl}/api/app/doctor-degree/${id}`
    );
  }

  getDoctorDegreeListByDoctorId(
    doctorId: number
  ): Observable<DoctorDegreeDto[]> {
    return this.http.get<DoctorDegreeDto[]>(
      `${this.baseUrl}/api/app/doctor-degree/doctor-degree-list-by-doctor-id/${doctorId}`
    );
  }

  getList(): Observable<DoctorDegreeDto[]> {
    return this.http.get<DoctorDegreeDto[]>(
      `${this.baseUrl}/api/app/doctor-degree`
    );
  }

  getListByDoctorId(doctorId: number): Observable<DoctorDegreeDto[]> {
    return this.http.get<DoctorDegreeDto[]>(
      `${this.baseUrl}/api/app/doctor-degree/by-doctor-id/${doctorId}`
    );
  }

  update(input: DoctorDegreeInputDto): Observable<DoctorDegreeDto> {
    return this.http.put<DoctorDegreeDto>(
      `${this.baseUrl}/api/app/doctor-degree`,
      input
    );
  }
}
