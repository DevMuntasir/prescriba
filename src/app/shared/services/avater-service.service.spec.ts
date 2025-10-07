import { TestBed } from '@angular/core/testing';

import { AvaterServiceService } from './avater-service.service';

describe('AvaterServiceService', () => {
  let service: AvaterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvaterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
