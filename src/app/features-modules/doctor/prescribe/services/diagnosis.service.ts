import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { prescriptionApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;

  constructor(private http: HttpClient) {}
  getAllDiagnoses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gets-all-diagnosis`);
  }

  getBookmarkedDiagnoses(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/gets-bookmarks-diagnosis?doctorId=${id}`
    );
  }

  searchDiagnosis(diagnosisName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gets-diagnosis-by-name`, {
      params: { diagnosisName },
    });
  }

  createDiagnosis(diagnosisName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-diagnosis`, {
      name: diagnosisName,
      description: '',
      code: '1',
    });
  }
}
