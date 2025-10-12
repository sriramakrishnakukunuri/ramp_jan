import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsmeByQuarterComponent } from './msme-by-quarter.component';

describe('MsmeByQuarterComponent', () => {
  let component: MsmeByQuarterComponent;
  let fixture: ComponentFixture<MsmeByQuarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsmeByQuarterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsmeByQuarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
