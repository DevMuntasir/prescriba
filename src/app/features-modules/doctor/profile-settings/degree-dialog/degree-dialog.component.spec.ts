import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DegreeDialogComponentnt } from './degree-dialog.component';

describe('DegreeDialogComponent', () => {
  let component: DegreeDialogComponentnt;
  let fixture: ComponentFixture<DegreeDialogComponentnt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DegreeDialogComponentnt ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DegreeDialogComponentnt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
