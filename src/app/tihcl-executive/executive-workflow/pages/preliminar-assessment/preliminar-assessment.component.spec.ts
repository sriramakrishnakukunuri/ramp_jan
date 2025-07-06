import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliminarAssessmentComponent } from './preliminar-assessment.component';

describe('PreliminarAssessmentComponent', () => {
  let component: PreliminarAssessmentComponent;
  let fixture: ComponentFixture<PreliminarAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreliminarAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreliminarAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
