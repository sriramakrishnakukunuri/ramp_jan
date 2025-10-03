import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressMonitoringReportComponent } from './progress-monitoring-report.component';

describe('ProgressMonitoringReportComponent', () => {
  let component: ProgressMonitoringReportComponent;
  let fixture: ComponentFixture<ProgressMonitoringReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressMonitoringReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressMonitoringReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
