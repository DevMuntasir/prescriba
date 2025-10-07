import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatisticscardComponent } from './dashboard-statisticscard.component';

describe('DashboardStatisticscardComponent', () => {
  let component: DashboardStatisticscardComponent;
  let fixture: ComponentFixture<DashboardStatisticscardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardStatisticscardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStatisticscardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
