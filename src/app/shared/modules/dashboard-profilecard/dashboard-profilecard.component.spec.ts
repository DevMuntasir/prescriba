import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProfilecardComponent } from './dashboard-profilecard.component';

describe('DashboardProfilecardComponent', () => {
  let component: DashboardProfilecardComponent;
  let fixture: ComponentFixture<DashboardProfilecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardProfilecardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardProfilecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
