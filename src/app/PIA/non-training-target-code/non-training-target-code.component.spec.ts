import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingTargetCodeComponent } from './non-training-target-code.component';

describe('NonTrainingTargetCodeComponent', () => {
  let component: NonTrainingTargetCodeComponent;
  let fixture: ComponentFixture<NonTrainingTargetCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingTargetCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingTargetCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
