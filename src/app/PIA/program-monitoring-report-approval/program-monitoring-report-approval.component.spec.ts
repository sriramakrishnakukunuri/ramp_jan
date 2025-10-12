import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramMonitoringReportApprovalComponent } from './program-monitoring-report-approval.component';

describe('ProgramMonitoringReportApprovalComponent', () => {
  let component: ProgramMonitoringReportApprovalComponent;
  let fixture: ComponentFixture<ProgramMonitoringReportApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramMonitoringReportApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramMonitoringReportApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
