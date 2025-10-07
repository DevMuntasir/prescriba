import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientBillingHistoryComponent } from './patient-billing-history.component';

describe('PatientBillingHistoryComponent', () => {
  let component: PatientBillingHistoryComponent;
  let fixture: ComponentFixture<PatientBillingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientBillingHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientBillingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
