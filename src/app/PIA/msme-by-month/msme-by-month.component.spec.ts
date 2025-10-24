import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsmeByMonthComponent } from './msme-by-month.component';

describe('MsmeByMonthComponent', () => {
  let component: MsmeByMonthComponent;
  let fixture: ComponentFixture<MsmeByMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsmeByMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsmeByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
