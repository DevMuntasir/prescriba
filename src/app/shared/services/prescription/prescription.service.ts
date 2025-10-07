import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { prescriptionApi } from 'src/environments/environment';
export type PrescriptionPdf = {
  prescriptionPdfID: number;
  tenantID: number;
  prescriptionID: number;
  doctorID: number | null;
  patientID: number | null;
  filePath: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isActive: boolean;
  appointmentRefId: number | null;
  doctorUserId: number;
  doctorName: string;
  patientUserId: number;
  patientName: string;
  followUpDate: string;
};

export type PrescriptionPdfResponse = {
  results: PrescriptionPdf[];
  message: string;
  isSuccess: boolean;
  statusCode: number;
  status: string;
};

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private baseUrl = `${prescriptionApi}/api/2025-02`;
  http = inject(HttpClient);
  constructor() {}
  getPrescriptionByPatientIdDoctorId(
    patientId: number,
    doctorId: number
  ): Observable<PrescriptionPdfResponse> {
    return this.http.get<PrescriptionPdfResponse>(
      `${this.baseUrl}/get-pdf-prescriptions-by-patient-doctor-id?patientId=${patientId}&doctorId=${doctorId}`
    );
  }
  getPreHandPrescriptionByDoctorId(
    doctorId: number
  ): Observable<PrescriptionPdfResponse> {
    return this.http.get<PrescriptionPdfResponse>(
      `${this.baseUrl}/get-pdf-prescriptions-by-doctor-prehand-id?doctorId=${doctorId}`
    );
  }

  getPrescriptionByPatientId(
    patientId: number
  ): Observable<PrescriptionPdfResponse> {
    return this.http.get<PrescriptionPdfResponse>(
      `${this.baseUrl}/get-pdf-prescriptions-by-patient-doctor-id?patientId=${patientId}`
    );
  }
  getPrescriptionByAppointmentId(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/get-prescription-pdf-by-appointment-id?appointmentId=${id}`
    );
  }
}
