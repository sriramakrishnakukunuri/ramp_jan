import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainigNontrainingTargetsComponent } from './trainig-nontraining-targets.component';

describe('TrainigNontrainingTargetsComponent', () => {
  let component: TrainigNontrainingTargetsComponent;
  let fixture: ComponentFixture<TrainigNontrainingTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainigNontrainingTargetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainigNontrainingTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
