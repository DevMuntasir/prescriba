import { TestBed } from '@angular/core/testing';

import { HospitalStateService } from './hospital-state.service';

describe('HospitalStateService', () => {
  let service: HospitalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HospitalStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
