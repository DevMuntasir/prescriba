import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMenuItemComponent } from './dashboard-menu-item.component';

describe('DashboardMenuItemComponent', () => {
  let component: DashboardMenuItemComponent;
  let fixture: ComponentFixture<DashboardMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMenuItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
