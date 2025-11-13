import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPatientsComponent } from './public-patients.component';

describe('PublicPatientsComponent', () => {
  let component: PublicPatientsComponent;
  let fixture: ComponentFixture<PublicPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicPatientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
