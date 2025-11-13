import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousDocumentsDialogComponent } from './previous-documents-dialog.component';

describe('PreviousDocumentsDialogComponent', () => {
  let component: PreviousDocumentsDialogComponent;
  let fixture: ComponentFixture<PreviousDocumentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousDocumentsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousDocumentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
