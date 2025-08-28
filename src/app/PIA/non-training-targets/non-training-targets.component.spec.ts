import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingTargetsComponent } from './non-training-targets.component';

describe('NonTrainingTargetsComponent', () => {
  let component: NonTrainingTargetsComponent;
  let fixture: ComponentFixture<NonTrainingTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingTargetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
