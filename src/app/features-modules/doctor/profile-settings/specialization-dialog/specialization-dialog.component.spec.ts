import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationDialogComponent } from './specialization-dialog.component';

describe('SpecializationDialogComponent', () => {
  let component: SpecializationDialogComponent;
  let fixture: ComponentFixture<SpecializationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecializationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecializationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
