import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppointmentCardComponent } from './list-appointment-card.component';

describe('ListAppointmentCardComponent', () => {
  let component: ListAppointmentCardComponent;
  let fixture: ComponentFixture<ListAppointmentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAppointmentCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAppointmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
