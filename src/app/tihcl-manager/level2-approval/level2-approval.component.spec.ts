import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level2ApprovalComponent } from './level2-approval.component';

describe('Level2ApprovalComponent', () => {
  let component: Level2ApprovalComponent;
  let fixture: ComponentFixture<Level2ApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level2ApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level2ApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
