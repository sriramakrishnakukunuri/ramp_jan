import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingTgtpc4Component } from './non-training-tgtpc4.component';

describe('NonTrainingTgtpc4Component', () => {
  let component: NonTrainingTgtpc4Component;
  let fixture: ComponentFixture<NonTrainingTgtpc4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingTgtpc4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingTgtpc4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
