import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { prescriptionApi } from 'src/environments/environment';

export interface PrescriptionPatient {
  patientID: number;
  userID: number;
  patientReferenceID: number;
  dateOfBirth: string;
  gender: string;
  address: string;
  bloodGroup: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  patientAge: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  referenceUserId: number;
  totalCount: number;
  patientName?:string
}

export interface PrescriptionPatientListResponse {
  result?: PrescriptionPatient[];
  message?: string;
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
  totalCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PrescriptionPatientService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;

  constructor(private http: HttpClient) {}

  getPrescriptionPatients(query: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
  } = {}): Observable<PrescriptionPatientListResponse> {
    const { pageNumber = 1, pageSize = 10, searchTerm } = query;

    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    const trimmedSearch = searchTerm?.trim();
    if (trimmedSearch) {
      params = params.set('searchTerm', trimmedSearch);
    }

    return this.http.get<PrescriptionPatientListResponse>(
      `${this.baseUrl}/gets-all-patients`,
      { params }
    );
  }
}
