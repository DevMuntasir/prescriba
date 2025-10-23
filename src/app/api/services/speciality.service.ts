import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type { SpecialityDto } from '../dto-models/models';
import type { SpecialityInputDto } from '../input-dto/models';

@Injectable({ providedIn: 'root' })
export class SpecialityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(input: SpecialityInputDto): Observable<SpecialityDto> {
    return this.http.post<SpecialityDto>(
      `${this.baseUrl}/api/app/speciality`,
      input
    );
  }

  get(id: number): Observable<SpecialityDto> {
    return this.http.get<SpecialityDto>(
      `${this.baseUrl}/api/app/speciality/${id}`
    );
  }

  getList(): Observable<SpecialityDto[]> {
    return this.http.get<SpecialityDto[]>(`${this.baseUrl}/api/app/speciality`);
  }

  update(input: SpecialityInputDto): Observable<SpecialityDto> {
    return this.http.put<SpecialityDto>(
      `${this.baseUrl}/api/app/speciality`,
      input
    );
  }
}
