import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { prescriptionApi } from 'src/environments/environment';

export interface PrescriptionAnalyticsResult {
  male: number;
  female: number;
  totalPrescription: number;
}

export interface PrescriptionAnalyticsResponse {
  results: PrescriptionAnalyticsResult;
  message: string;
  isSuccess: boolean;
  statusCode: number;
  status: string;
}

export interface MedicationUsage {
  medicationId: number;
  medicationName: string;
  usageCount: number;
  totalCount: number | null;
  manufacturer: string;
  genericName: string;
}

export interface MedicationUsageResponse {
  totalCount: number;
  result: MedicationUsage[];
  results?: MedicationUsage[];
  message: string;
  isSuccess: boolean;
  statusCode: number;
  status: string;
}

export interface MedicationDivisionUsage {
  divisionName: string;
  totalPrescriptions: number;
}

export interface MedicationDivisionUsageResponse {
  result?: MedicationDivisionUsage[];
  results?: MedicationDivisionUsage[];
  message?: string;
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminPrescriptionService {
  private readonly baseUrl = prescriptionApi + '/api/2025-02';

  constructor(private http: HttpClient) {}

  getPrescriptionAnalytics(): Observable<PrescriptionAnalyticsResponse> {
    return this.http.get<PrescriptionAnalyticsResponse>(
      this.baseUrl + '/get-prescription-analytics'
    );
  }

  getMostUsedMedications(
    pageNumber = 1,
    pageSize = 10
  ): Observable<MedicationUsageResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<MedicationUsageResponse>(
      this.baseUrl + '/gets-most-used-medication',
      { params }
    );
  }

  getMedicationDivisionUsage(
    medicationId: number
  ): Observable<MedicationDivisionUsageResponse> {
    const params = new HttpParams().set('medicationId', medicationId);

    return this.http.get<MedicationDivisionUsageResponse>(
      this.baseUrl + '/get-medication-division-usage',
      { params }
    );
  }
}

