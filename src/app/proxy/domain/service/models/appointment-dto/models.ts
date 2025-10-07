
export interface AppointmentPatientDto {
  patientProfileId: number;
  patientCode?: string;
  patientName?: string;
  patientMobileNo?: string;
  patientEmail?: string;
  patientLocation?: string;
  bloodGroup?: string;
  gender?: string;
  patientAge?: number;
  doctorProfileId: number;
}
