import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsPrescriptionsComponent } from './doctors-prescriptions.component';

describe('DoctorsPrescriptionsComponent', () => {
  let component: DoctorsPrescriptionsComponent;
  let fixture: ComponentFixture<DoctorsPrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsPrescriptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorsPrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
