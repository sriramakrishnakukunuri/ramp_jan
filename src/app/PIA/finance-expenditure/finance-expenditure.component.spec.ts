import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceExpenditureComponent } from './finance-expenditure.component';

describe('FinanceExpenditureComponent', () => {
  let component: FinanceExpenditureComponent;
  let fixture: ComponentFixture<FinanceExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceExpenditureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
