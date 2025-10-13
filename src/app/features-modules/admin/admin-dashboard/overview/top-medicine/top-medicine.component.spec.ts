import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMedicineComponent } from './top-medicine.component';

describe('TopMedicineComponent', () => {
  let component: TopMedicineComponent;
  let fixture: ComponentFixture<TopMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopMedicineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
