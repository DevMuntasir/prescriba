import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionSkeltonComponent } from './prescription-skelton.component';

describe('PrescriptionSkeltonComponent', () => {
  let component: PrescriptionSkeltonComponent;
  let fixture: ComponentFixture<PrescriptionSkeltonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionSkeltonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescriptionSkeltonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
