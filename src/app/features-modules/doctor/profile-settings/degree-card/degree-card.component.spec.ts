import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeCardComponent } from './degree-card.component';

describe('DegreeCardComponent', () => {
  let component: DegreeCardComponent;
  let fixture: ComponentFixture<DegreeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DegreeCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DegreeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
