import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type { SpecializationDto } from '../dto-models/models';
import type { SpecializationInputDto } from '../input-dto/models';

@Injectable({ providedIn: 'root' })
export class SpecializationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(input: SpecializationInputDto): Observable<SpecializationDto> {
    return this.http.post<SpecializationDto>(
      `${this.baseUrl}/api/app/specialization`,
      input
    );
  }

  get(id: number): Observable<SpecializationDto> {
    return this.http.get<SpecializationDto>(
      `${this.baseUrl}/api/app/specialization/${id}`
    );
  }

  getBySpecialityId(specialityId: number): Observable<SpecializationDto> {
    return this.http.get<SpecializationDto>(
      `${this.baseUrl}/api/app/specialization/by-speciality-id/${specialityId}`
    );
  }

  getList(): Observable<SpecializationDto[]> {
    return this.http.get<SpecializationDto[]>(
      `${this.baseUrl}/api/app/specialization`
    );
  }

  getListBySpecialtyId(
    specialityId: number
  ): Observable<SpecializationDto[]> {
    return this.http.get<SpecializationDto[]>(
      `${this.baseUrl}/api/app/specialization/by-specialty-id/${specialityId}`
    );
  }

  getListFiltering(): Observable<SpecializationDto[]> {
    return this.http.get<SpecializationDto[]>(
      `${this.baseUrl}/api/app/specialization/filtering`
    );
  }

  update(input: SpecializationInputDto): Observable<SpecializationDto> {
    return this.http.put<SpecializationDto>(
      `${this.baseUrl}/api/app/specialization`,
      input
    );
  }
}
