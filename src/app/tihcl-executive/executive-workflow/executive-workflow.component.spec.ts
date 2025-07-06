import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveWorkflowComponent } from './executive-workflow.component';

describe('ExecutiveWorkflowComponent', () => {
  let component: ExecutiveWorkflowComponent;
  let fixture: ComponentFixture<ExecutiveWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecutiveWorkflowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutiveWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
