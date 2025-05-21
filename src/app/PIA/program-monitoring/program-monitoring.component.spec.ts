import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramMonitoringComponent } from './program-monitoring.component';

describe('ProgramMonitoringComponent', () => {
  let component: ProgramMonitoringComponent;
  let fixture: ComponentFixture<ProgramMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
