import { TestBed } from '@angular/core/testing';

import { DoctorScheduleStateService } from './doctor-schedule-state.service';

describe('DoctorScheduleStateService', () => {
  let service: DoctorScheduleStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorScheduleStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
