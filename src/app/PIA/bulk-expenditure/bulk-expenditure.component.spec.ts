import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkExpenditureComponent } from './bulk-expenditure.component';

describe('BulkExpenditureComponent', () => {
  let component: BulkExpenditureComponent;
  let fixture: ComponentFixture<BulkExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkExpenditureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
