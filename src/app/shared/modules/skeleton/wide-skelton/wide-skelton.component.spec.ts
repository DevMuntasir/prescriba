import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WideSkeltonComponent } from './wide-skelton.component';

describe('WideSkeltonComponent', () => {
  let component: WideSkeltonComponent;
  let fixture: ComponentFixture<WideSkeltonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WideSkeltonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WideSkeltonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
