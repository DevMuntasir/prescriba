import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrningComponent } from './warrning.component';

describe('WarrningComponent', () => {
  let component: WarrningComponent;
  let fixture: ComponentFixture<WarrningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarrningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarrningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
