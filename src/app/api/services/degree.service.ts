import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-urls';
import type { DegreeDto } from '../dto-models/models';
import type { DegreeInputDto } from '../input-dto/models';

@Injectable({ providedIn: 'root' })
export class DegreeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  create(input: DegreeInputDto): Observable<DegreeDto> {
    return this.http.post<DegreeDto>(`${this.baseUrl}/api/app/degree`, input);
  }

  get(id: number): Observable<DegreeDto> {
    return this.http.get<DegreeDto>(`${this.baseUrl}/api/app/degree/${id}`);
  }

  getList(): Observable<DegreeDto[]> {
    return this.http.get<DegreeDto[]>(`${this.baseUrl}/api/app/degree`);
  }

  update(input: DegreeInputDto): Observable<DegreeDto> {
    return this.http.put<DegreeDto>(`${this.baseUrl}/api/app/degree`, input);
  }
}
