import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableDayTimeComponent } from './available-day-time.component';

describe('AvailableDayTimeComponent', () => {
  let component: AvailableDayTimeComponent;
  let fixture: ComponentFixture<AvailableDayTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableDayTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvailableDayTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
