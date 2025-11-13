import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { prescriptionApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvestigationService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;

  constructor(private http: HttpClient) {}

  getAllInvestigations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gets-all-investigation`);
  }
  getInvestigationByName(investigationName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gets-all-investigation-by-name`, {
      params: { investigationName },
    });
  }
  createInvestigation(investigationName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-investigation`, {
      name: investigationName,
      description: '',
      code: '123',
    });
  }
}
