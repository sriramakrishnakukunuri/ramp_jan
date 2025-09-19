import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionedAmountComponent } from './sanctioned-amount.component';

describe('SanctionedAmountComponent', () => {
  let component: SanctionedAmountComponent;
  let fixture: ComponentFixture<SanctionedAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionedAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionedAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
