import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorChamberInfoComponent } from './doctor-chamber-info.component';

describe('DoctorChamberInfoComponent', () => {
  let component: DoctorChamberInfoComponent;
  let fixture: ComponentFixture<DoctorChamberInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorChamberInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorChamberInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
