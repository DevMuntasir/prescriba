import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TosterService } from './toster.service';

describe('TosterService', () => {
  let service: TosterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
    });
    service = TestBed.inject(TosterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
