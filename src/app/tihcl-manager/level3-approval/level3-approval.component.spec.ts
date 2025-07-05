import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level3ApprovalComponent } from './level3-approval.component';

describe('Level3ApprovalComponent', () => {
  let component: Level3ApprovalComponent;
  let fixture: ComponentFixture<Level3ApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level3ApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level3ApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
