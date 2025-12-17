import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PRESCRIPTION_API_BASE_URL } from "../api-urls"
export interface DivisionModel {
  divisionID: number;
  divisionName: string;
}

export interface DistrictModel {
  districtID: number;
  districtName: string;
  divisionID: number;
}

interface LocationApiResponse<T> {
  results: T[];
  message: string;
  isSuccess: boolean;
  statusCode: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = PRESCRIPTION_API_BASE_URL;

  getDivisions(): Observable<LocationApiResponse<DivisionModel>> {
    return this.http.get<LocationApiResponse<DivisionModel>>(
      `${this.baseUrl}/api/2025-02/gets-all-division_list`
    );
  }

  getDistricts(
    divisionId: number
  ): Observable<LocationApiResponse<DistrictModel>> {
    return this.http.get<LocationApiResponse<DistrictModel>>(
      `${this.baseUrl}/api/2025-02/gets_district_by_division_id?divisonId=${divisionId}`
    );
  }
}
