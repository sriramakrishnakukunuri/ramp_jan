import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingTihclComponent } from './non-training-tihcl.component';

describe('NonTrainingTihclComponent', () => {
  let component: NonTrainingTihclComponent;
  let fixture: ComponentFixture<NonTrainingTihclComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingTihclComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingTihclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
