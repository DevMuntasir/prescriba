import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLiveDoctorCardComponent } from './dashboard-live-doctor-card.component';

describe('DashboardLiveDoctorCardComponent', () => {
  let component: DashboardLiveDoctorCardComponent;
  let fixture: ComponentFixture<DashboardLiveDoctorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLiveDoctorCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardLiveDoctorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
