import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProgramExecutionComponent } from './update-program-execution.component';

describe('UpdateProgramExecutionComponent', () => {
  let component: UpdateProgramExecutionComponent;
  let fixture: ComponentFixture<UpdateProgramExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProgramExecutionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProgramExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
