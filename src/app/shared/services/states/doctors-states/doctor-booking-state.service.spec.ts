import { TestBed } from '@angular/core/testing';

import { DoctorBookingStateService } from './doctor-booking-state.service';

describe('DoctorBookingStateService', () => {
  let service: DoctorBookingStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorBookingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
