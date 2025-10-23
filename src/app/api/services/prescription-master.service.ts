import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, PRESCRIPTION_API_BASE_URL } from '../api-urls';
import type {
  PrescriptionMasterDto,
  PrescriptionPatientDiseaseHistoryDto,
} from '../dto-models/models';
import type { PrescriptionMasterInputDto } from '../input-dto/models';

@Injectable({ providedIn: 'root' })
export class PrescriptionMasterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;
  private readonly prescriptionApiBase = PRESCRIPTION_API_BASE_URL;

  create(
    input: PrescriptionMasterInputDto
  ): Observable<PrescriptionMasterDto> {
    return this.http.post<PrescriptionMasterDto>(
      `${this.baseUrl}/api/app/prescription-master`,
      input
    );
  }

  get(id: number): Observable<PrescriptionMasterDto> {
    return this.http.get<PrescriptionMasterDto>(
      `${this.baseUrl}/api/app/prescription-master/${id}`
    );
  }

  getList(): Observable<PrescriptionMasterDto[]> {
    return this.http.get<PrescriptionMasterDto[]>(
      `${this.baseUrl}/api/app/prescription-master`
    );
  }

  getPatientDiseaseList(
    patientId: number
  ): Observable<PrescriptionPatientDiseaseHistoryDto[]> {
    return this.http.get<PrescriptionPatientDiseaseHistoryDto[]>(
      `${this.baseUrl}/api/app/prescription-master/patient-disease-list/${patientId}`
    );
  }

  getPrescription(id: number): Observable<PrescriptionMasterDto> {
    return this.http.get<PrescriptionMasterDto>(
      `${this.prescriptionApiBase}/api/app/prescription-master/${id}/prescription`
    );
  }

  getPrescriptionByAppointmentId(
    appointmentId: number
  ): Observable<PrescriptionMasterDto> {
    return this.http.get<PrescriptionMasterDto>(
      `${this.prescriptionApiBase}/api/app/prescription-master/prescription-by-appointment-id/${appointmentId}`
    );
  }

  getPrescriptionCount(): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/api/app/prescription-master/prescription-count`
    );
  }

  getPrescriptionListByAppointmentCreatorId(
    patientId: number
  ): Observable<PrescriptionMasterDto[]> {
    return this.http.get<PrescriptionMasterDto[]>(
      `${this.baseUrl}/api/app/prescription-master/prescription-list-by-appointment-creator-id/${patientId}`
    );
  }

  getPrescriptionMasterListByDoctorId(
    doctorId: number
  ): Observable<PrescriptionMasterDto[]> {
    return this.http.get<PrescriptionMasterDto[]>(
      `${this.baseUrl}/api/app/prescription-master/prescription-master-list-by-doctor-id/${doctorId}`
    );
  }

  getPrescriptionMasterListByDoctorIdPatientId(
    doctorId: number,
    patientId: number
  ): Observable<PrescriptionMasterDto[]> {
    const params = new HttpParams()
      .set('doctorId', String(doctorId))
      .set('patientId', String(patientId));

    return this.http.get<PrescriptionMasterDto[]>(
      `${this.baseUrl}/api/app/prescription-master/prescription-master-list-by-doctor-id-patient-id`,
      { params }
    );
  }

  getPrescriptionMasterListByPatientId(
    patientId: number
  ): Observable<PrescriptionMasterDto[]> {
    return this.http.get<PrescriptionMasterDto[]>(
      `${this.baseUrl}/api/app/prescription-master/prescription-master-list-by-patient-id/${patientId}`
    );
  }

  update(
    input: PrescriptionMasterInputDto
  ): Observable<PrescriptionMasterDto> {
    return this.http.put<PrescriptionMasterDto>(
      `${this.baseUrl}/api/app/prescription-master`,
      input
    );
  }
}
