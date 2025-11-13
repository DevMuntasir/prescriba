import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { prescriptionApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdviceService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;

  constructor(private http: HttpClient) {}

  getAllAdvice(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gets-all-advice`);
  }
  getBookmarkedAdvice(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/gets-bookmarks-advice?doctorId=${id}`
    );
  }
  searchAdvice(adviceName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gets-advice-by-name`, {
      params: { adviceName },
    });
  }
  createAdvice(name: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create-advice`, {
      advice: name,
      type: 'string',
      tenantId: 1,
    });
  }
}
