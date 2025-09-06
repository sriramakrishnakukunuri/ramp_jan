import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingCoiComponent } from './non-training-coi.component';

describe('NonTrainingCoiComponent', () => {
  let component: NonTrainingCoiComponent;
  let fixture: ComponentFixture<NonTrainingCoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingCoiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingCoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
