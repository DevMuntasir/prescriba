import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientNewPrescriptionComponent } from './patient-new-prescription.component';

describe('PatientNewPrescriptionComponent', () => {
  let component: PatientNewPrescriptionComponent;
  let fixture: ComponentFixture<PatientNewPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientNewPrescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatientNewPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
