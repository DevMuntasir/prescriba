import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalScheduleComponent } from './hospital-schedule.component';

describe('HospitalScheduleComponent', () => {
  let component: HospitalScheduleComponent;
  let fixture: ComponentFixture<HospitalScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
