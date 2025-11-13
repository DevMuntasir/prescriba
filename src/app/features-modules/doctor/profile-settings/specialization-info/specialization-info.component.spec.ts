import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationInfoComponent } from './specialization-info.component';

describe('SpecializationInfoComponent', () => {
  let component: SpecializationInfoComponent;
  let fixture: ComponentFixture<SpecializationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecializationInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
