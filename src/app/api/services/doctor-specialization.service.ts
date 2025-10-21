import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type { DoctorSpecializationDto } from '../dto-models/models';
import type { DoctorSpecializationInputDto } from '../input-dto/models';

@Injectable({ providedIn: 'root' })
export class DoctorSpecializationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(
    input: DoctorSpecializationInputDto
  ): Observable<DoctorSpecializationDto> {
    return this.http.post<DoctorSpecializationDto>(
      `${this.baseUrl}/api/app/doctor-specialization`,
      input
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/app/doctor-specialization/${id}`
    );
  }

  get(id: number): Observable<DoctorSpecializationDto> {
    return this.http.get<DoctorSpecializationDto>(
      `${this.baseUrl}/api/app/doctor-specialization/${id}`
    );
  }

  getBySpecialityId(specialityId: number): Observable<DoctorSpecializationDto> {
    return this.http.get<DoctorSpecializationDto>(
      `${this.baseUrl}/api/app/doctor-specialization/by-speciality-id/${specialityId}`
    );
  }

  getDoctorSpecializationListByDoctorId(
    doctorId: number
  ): Observable<DoctorSpecializationDto[]> {
    return this.http.get<DoctorSpecializationDto[]>(
      `${this.baseUrl}/api/app/doctor-specialization/doctor-specialization-list-by-doctor-id/${doctorId}`
    );
  }

  getDoctorSpecializationListByDoctorIdSpecialityId(
    doctorId: number,
    specialityId: number
  ): Observable<DoctorSpecializationDto[]> {
    const params = new HttpParams()
      .set('doctorId', String(doctorId))
      .set('specialityId', String(specialityId));

    return this.http.get<DoctorSpecializationDto[]>(
      `${this.baseUrl}/api/app/doctor-specialization/doctor-specialization-list-by-doctor-id-speciality-id`,
      { params }
    );
  }

  getDoctorSpecializationListBySpecialityId(
    specialityId: number
  ): Observable<DoctorSpecializationDto[]> {
    return this.http.get<DoctorSpecializationDto[]>(
      `${this.baseUrl}/api/app/doctor-specialization/doctor-specialization-list-by-speciality-id/${specialityId}`
    );
  }

  getList(): Observable<DoctorSpecializationDto[]> {
    return this.http.get<DoctorSpecializationDto[]>(
      `${this.baseUrl}/api/app/doctor-specialization`
    );
  }

  getListByDoctorIdSpId(
    doctorId: number,
    specialityId: number
  ): Observable<DoctorSpecializationDto[]> {
    const params = new HttpParams()
      .set('doctorId', String(doctorId))
      .set('specialityId', String(specialityId));

    return this.http.get<DoctorSpecializationDto[]>(
      `${this.baseUrl}/api/app/doctor-specialization/by-doctor-id-sp-id`,
      { params }
    );
  }

  update(
    input: DoctorSpecializationInputDto
  ): Observable<DoctorSpecializationDto> {
    return this.http.put<DoctorSpecializationDto>(
      `${this.baseUrl}/api/app/doctor-specialization`,
      input
    );
  }
}
