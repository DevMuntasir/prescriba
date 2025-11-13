import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribeComponent } from './prescribe.component';

describe('PrescribeComponent', () => {
  let component: PrescribeComponent;
  let fixture: ComponentFixture<PrescribeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescribeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
