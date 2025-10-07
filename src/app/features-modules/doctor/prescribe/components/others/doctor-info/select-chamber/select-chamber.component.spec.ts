import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectChamberComponent } from './select-chamber.component';

describe('SelectChamberComponent', () => {
  let component: SelectChamberComponent;
  let fixture: ComponentFixture<SelectChamberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectChamberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectChamberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
