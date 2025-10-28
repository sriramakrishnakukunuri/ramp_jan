import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentLedgerComponent } from './repayment-ledger.component';

describe('RepaymentLedgerComponent', () => {
  let component: RepaymentLedgerComponent;
  let fixture: ComponentFixture<RepaymentLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepaymentLedgerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepaymentLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
