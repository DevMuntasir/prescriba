import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { prescriptionApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  baseUrl = `${prescriptionApi}/api/2025-02`;
  private http = inject(HttpClient);
  uploadPrescriptionImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/prescription-upload`, formData);
  }
}
