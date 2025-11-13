import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPrescriptionModalComponent } from './show-prescription-modal.component';

describe('ShowPrescriptionModalComponent', () => {
  let component: ShowPrescriptionModalComponent;
  let fixture: ComponentFixture<ShowPrescriptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowPrescriptionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPrescriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
