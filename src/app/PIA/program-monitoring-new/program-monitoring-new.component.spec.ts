import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramMonitoringNewComponent } from './program-monitoring-new.component';

describe('ProgramMonitoringNewComponent', () => {
  let component: ProgramMonitoringNewComponent;
  let fixture: ComponentFixture<ProgramMonitoringNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramMonitoringNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramMonitoringNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
