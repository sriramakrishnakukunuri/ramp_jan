import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressMonitoringComponent } from './progress-monitoring.component';

describe('ProgressMonitoringComponent', () => {
  let component: ProgressMonitoringComponent;
  let fixture: ComponentFixture<ProgressMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
