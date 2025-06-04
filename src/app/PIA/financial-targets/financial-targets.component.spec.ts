import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialTargetsComponent } from './financial-targets.component';

describe('FinancialTargetsComponent', () => {
  let component: FinancialTargetsComponent;
  let fixture: ComponentFixture<FinancialTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialTargetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
