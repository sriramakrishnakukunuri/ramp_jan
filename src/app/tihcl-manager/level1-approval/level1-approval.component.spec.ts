import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level1ApprovalComponent } from './level1-approval.component';

describe('Level1ApprovalComponent', () => {
  let component: Level1ApprovalComponent;
  let fixture: ComponentFixture<Level1ApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level1ApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Level1ApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
