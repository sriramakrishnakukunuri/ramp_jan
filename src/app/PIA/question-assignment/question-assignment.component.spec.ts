import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAssignmentComponent } from './question-assignment.component';

describe('QuestionAssignmentComponent', () => {
  let component: QuestionAssignmentComponent;
  let fixture: ComponentFixture<QuestionAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionAssignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
