import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyRangeComponent } from './monthly-range.component';

describe('MonthlyRangeComponent', () => {
  let component: MonthlyRangeComponent;
  let fixture: ComponentFixture<MonthlyRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyRangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
