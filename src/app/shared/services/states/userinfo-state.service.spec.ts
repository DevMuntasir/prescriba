import { TestBed } from '@angular/core/testing';

import { UserinfoStateService } from './userinfo-state.service';

describe('UserinfoStateService', () => {
  let service: UserinfoStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserinfoStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
