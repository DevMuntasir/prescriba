import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SymptomDto } from './model/model';
import { prescriptionApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;

  constructor(private http: HttpClient) {}

  getAllHistory(): Observable<SymptomDto> {
    return this.http.get<any>(`${this.baseUrl}/gets-all-common-history`);
  }

  getBookmarkedHistory(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/gets-bookmarks-common-histories?doctorId=${id}`
    );
  }

  searchHistoryName(name: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/gets-all-common-history-by-name`,
      {
        params: { CommonHistoryName: name },
      }
    );
  }
  createHistory(name: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create-common-history`, {
      name,
      description: '',
      tenantId: 1,
    });
  }
}
