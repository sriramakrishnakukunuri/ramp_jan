import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingTargetsComponent } from './training-targets.component';

describe('TrainingTargetsComponent', () => {
  let component: TrainingTargetsComponent;
  let fixture: ComponentFixture<TrainingTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingTargetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
