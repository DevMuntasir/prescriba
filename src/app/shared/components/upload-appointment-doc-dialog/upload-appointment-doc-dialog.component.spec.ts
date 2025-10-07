import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAppointmentDocDialogComponent } from './upload-appointment-doc-dialog.component';

describe('UploadAppointmentDocDialogComponent', () => {
  let component: UploadAppointmentDocDialogComponent;
  let fixture: ComponentFixture<UploadAppointmentDocDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadAppointmentDocDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAppointmentDocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
