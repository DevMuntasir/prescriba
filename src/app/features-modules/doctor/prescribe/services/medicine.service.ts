import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { prescriptionApi } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MedicineService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;

  constructor(private http: HttpClient) {}

  getAllMedicines(): Observable<any> {
    return this.http.get(`${this.baseUrl}/gets-all-medication`);
  }

  getBookmarkedMedicines(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/gets-bookmarks-medication?doctorId=${id}`
    );
  }

  searchMedicine(medicationName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-medication-by-name`, {
      params: { medicationName },
    });
  }
  createMedicine(medicationName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/create-medication`, {
      tenantId: 1,
      medicationName: medicationName,
      description: 'string',
      manufacturer: 'string',
      dosageForm: '',
      strength: '',
      medicationBrandId: 0,
      genericName: '',
      dar: 'string',
    });
  }
}
