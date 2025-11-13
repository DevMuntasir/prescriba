import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

export interface PatientAgeDistribution {
  ageGroup: string;
  patientCount: number;
  percentage: number;
}

export interface PatientAgeDistributionResponse {
  results?: PatientAgeDistribution[];
  result?: PatientAgeDistribution[];
  message?: string;
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
}

export interface CompanyPerformanceSummary {
  companyId?: number;
  companyName: string;
  prescriptionCount: number;
  marketSharePercent: number;
  topDistricts?: string[];
  trendDirection?: 'up' | 'down' | 'steady';
  trendPercent?: number;
}

export interface CompanyPerformanceOverviewResponse {
  results?: CompanyPerformanceSummary[];
  result?: CompanyPerformanceSummary[];
  message?: string;
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
}

export interface CompanyMarketShareSegment {
  companyName: string;
  marketSharePercent: number;
}

export interface CompanyMedicineLeader {
  medicineName: string;
  leadingCompany: string;
  prescriptionCount: number;
  marketSharePercent?: number;
}

export interface CompanyPerformanceTrendPoint {
  period: string;
  prescriptionCount: number;
}

export interface CompanyPerformanceTrendSeries {
  companyName: string;
  points: CompanyPerformanceTrendPoint[];
}

export interface CompanyPerformanceInsightsResponse {
  summary?: CompanyPerformanceSummary[];
  marketShare?: CompanyMarketShareSegment[];
  leadingMedicines?: CompanyMedicineLeader[];
  trends?: CompanyPerformanceTrendSeries[];
  message?: string;
  isSuccess?: boolean;
  statusCode?: number;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminPrescriptionService {
  private readonly baseUrl = prescriptionApi + '/api/2025-02';
  private readonly mockCompanyPerformanceOverview: CompanyPerformanceSummary[] = [
    {
      companyId: 1,
      companyName: 'MediPharm Ltd',
      prescriptionCount: 832,
      marketSharePercent: 28.5,
      topDistricts: ['Dhaka', 'Chattogram', 'Sylhet'],
      trendDirection: 'up',
      trendPercent: 6.4,
    },
    {
      companyId: 2,
      companyName: 'HealthSphere Pharma',
      prescriptionCount: 676,
      marketSharePercent: 23,
      topDistricts: ['Rajshahi', 'Barishal', 'Rangpur'],
      trendDirection: 'steady',
      trendPercent: 0,
    },
    {
      companyId: 3,
      companyName: 'Zenith Therapeutics',
      prescriptionCount: 548,
      marketSharePercent: 18.5,
      topDistricts: ['Khulna', 'Dhaka', 'Mymensingh'],
      trendDirection: 'up',
      trendPercent: 3.1,
    },
    {
      companyId: 4,
      companyName: 'NovaCare Industries',
      prescriptionCount: 412,
      marketSharePercent: 15,
      topDistricts: ['Sylhet', 'Cumilla', 'Dhaka'],
      trendDirection: 'down',
      trendPercent: -1.8,
    },
    {
      companyId: 5,
      companyName: 'Everest Labs',
      prescriptionCount: 312,
      marketSharePercent: 12,
      topDistricts: ['Bogura', 'Jessore', 'Barishal'],
      trendDirection: 'up',
      trendPercent: 2.4,
    },
  ];

  private readonly mockCompanyPerformanceInsights: CompanyPerformanceInsightsResponse = {
    summary: [
      ...this.mockCompanyPerformanceOverview,
      {
        companyId: 6,
        companyName: 'Vertex Healthcare',
        prescriptionCount: 268,
        marketSharePercent: 9,
        topDistricts: ['Dhaka', 'Khulna', 'Sylhet'],
        trendDirection: 'steady',
        trendPercent: 0.5,
      },
    ],
    marketShare: [
      { companyName: 'MediPharm Ltd', marketSharePercent: 28.5 },
      { companyName: 'HealthSphere Pharma', marketSharePercent: 23 },
      { companyName: 'Zenith Therapeutics', marketSharePercent: 18.5 },
      { companyName: 'NovaCare Industries', marketSharePercent: 15 },
      { companyName: 'Everest Labs', marketSharePercent: 12 },
      { companyName: 'Vertex Healthcare', marketSharePercent: 3 },
    ],
    leadingMedicines: [
      {
        medicineName: 'Metformin 500mg',
        leadingCompany: 'MediPharm Ltd',
        prescriptionCount: 420,
        marketSharePercent: 34.2,
      },
      {
        medicineName: 'Amlodipine 5mg',
        leadingCompany: 'HealthSphere Pharma',
        prescriptionCount: 356,
        marketSharePercent: 29.5,
      },
      {
        medicineName: 'Losartan 50mg',
        leadingCompany: 'Zenith Therapeutics',
        prescriptionCount: 298,
        marketSharePercent: 26.8,
      },
      {
        medicineName: 'Atorvastatin 20mg',
        leadingCompany: 'NovaCare Industries',
        prescriptionCount: 184,
        marketSharePercent: 22.4,
      },
      {
        medicineName: 'Empagliflozin 10mg',
        leadingCompany: 'Everest Labs',
        prescriptionCount: 168,
        marketSharePercent: 18.9,
      },
    ],
    trends: [
      {
        companyName: 'MediPharm Ltd',
        points: [
          { period: 'Feb 2025', prescriptionCount: 720 },
          { period: 'Mar 2025', prescriptionCount: 748 },
          { period: 'Apr 2025', prescriptionCount: 802 },
          { period: 'May 2025', prescriptionCount: 832 },
        ],
      },
      {
        companyName: 'HealthSphere Pharma',
        points: [
          { period: 'Feb 2025', prescriptionCount: 668 },
          { period: 'Mar 2025', prescriptionCount: 674 },
          { period: 'Apr 2025', prescriptionCount: 676 },
          { period: 'May 2025', prescriptionCount: 676 },
        ],
      },
      {
        companyName: 'Zenith Therapeutics',
        points: [
          { period: 'Feb 2025', prescriptionCount: 504 },
          { period: 'Mar 2025', prescriptionCount: 528 },
          { period: 'Apr 2025', prescriptionCount: 538 },
          { period: 'May 2025', prescriptionCount: 548 },
        ],
      },
      {
        companyName: 'NovaCare Industries',
        points: [
          { period: 'Feb 2025', prescriptionCount: 428 },
          { period: 'Mar 2025', prescriptionCount: 420 },
          { period: 'Apr 2025', prescriptionCount: 416 },
          { period: 'May 2025', prescriptionCount: 412 },
        ],
      },
      {
        companyName: 'Everest Labs',
        points: [
          { period: 'Feb 2025', prescriptionCount: 288 },
          { period: 'Mar 2025', prescriptionCount: 296 },
          { period: 'Apr 2025', prescriptionCount: 304 },
          { period: 'May 2025', prescriptionCount: 312 },
        ],
      },
    ],
    message: 'Mock company performance insights.',
    isSuccess: true,
    statusCode: 200,
    status: 'success',
  };

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

  getPatientAgeDistribution(): Observable<PatientAgeDistributionResponse> {
    return this.http.get<PatientAgeDistributionResponse>(
      this.baseUrl + '/get-age-distribution'
    );
  }

  getCompanyPerformanceOverview(
    limit = 5
  ): Observable<CompanyPerformanceOverviewResponse> {
    const items = this.mockCompanyPerformanceOverview.slice(0, Math.max(0, limit));

    return of({
      results: items,
      message: 'Mock company performance overview.',
      isSuccess: true,
      statusCode: 200,
      status: 'success',
    });
  }

  getCompanyPerformanceInsights(): Observable<CompanyPerformanceInsightsResponse> {
    return of(this.mockCompanyPerformanceInsights);
  }
}