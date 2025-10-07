import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SymptomDto } from './model/model';
import { prescriptionApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChiefComplaintsService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;

  constructor(private http: HttpClient) {}

  getAllChiefComplaints(): Observable<SymptomDto> {
    return this.http.get<any>(`${this.baseUrl}/gets-all-chief-complaint`);
  }

  getBookmarkedChiefComplaints(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/gets-bookmarks-chief-complaints?doctorId=${id}`
    );
  }

  searchChiefComplaints(symptomName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/gets-chief-complaint-by-name`, {
      params: { SymtomName: symptomName },
    });
  }
  createChiefComplaints(name: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create-chief-complaint`, {
      symptomName: name,
      description: '',
      tenantId: 1,
    });
  }
}
