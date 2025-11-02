import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingRich6aComponent } from './non-training-rich6a.component';

describe('NonTrainingRich6aComponent', () => {
  let component: NonTrainingRich6aComponent;
  let fixture: ComponentFixture<NonTrainingRich6aComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingRich6aComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingRich6aComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
