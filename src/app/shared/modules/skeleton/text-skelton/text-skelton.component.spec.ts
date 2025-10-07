import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSkeltonComponent } from './text-skelton.component';

describe('TextSkeltonComponent', () => {
  let component: TextSkeltonComponent;
  let fixture: ComponentFixture<TextSkeltonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextSkeltonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextSkeltonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
