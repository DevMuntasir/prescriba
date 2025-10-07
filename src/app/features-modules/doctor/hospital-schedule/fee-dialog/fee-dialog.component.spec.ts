import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDialogComponent } from './fee-dialog.component';

describe('FeeDialogComponent', () => {
  let component: FeeDialogComponent;
  let fixture: ComponentFixture<FeeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
