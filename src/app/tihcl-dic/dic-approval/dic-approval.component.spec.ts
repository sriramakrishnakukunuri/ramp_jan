import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DicApprovalComponent } from './dic-approval.component';

describe('DicApprovalComponent', () => {
  let component: DicApprovalComponent;
  let fixture: ComponentFixture<DicApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DicApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DicApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
