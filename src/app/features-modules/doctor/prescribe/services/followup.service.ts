import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { prescriptionApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FollowupService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;

  constructor(private http: HttpClient) {}

  getFollowUpByName(followUpName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/gets-all-followup-by-name`, {
      params: { followUpName },
    });
  }

  createFollowUp(followUp: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-followup`, {
      tenantId: 1,
      name: followUp,
      description: '',
    });
  }
  getBookmarkedFollowup(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/gets-bookmarks-followup`);
  }
}
