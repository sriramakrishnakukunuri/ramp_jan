import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingTgtpc10Component } from './non-training-tgtpc10.component';

describe('NonTrainingTgtpc10Component', () => {
  let component: NonTrainingTgtpc10Component;
  let fixture: ComponentFixture<NonTrainingTgtpc10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingTgtpc10Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingTgtpc10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
