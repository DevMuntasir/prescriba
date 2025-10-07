import { TestBed } from '@angular/core/testing';

import { DoctorPatientAppointmentService } from './doctor-patient-appointment.service';

describe('DoctorPatientAppointmentService', () => {
  let service: DoctorPatientAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorPatientAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
