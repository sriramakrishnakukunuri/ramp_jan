import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingCipetComponent } from './non-training-cipet.component';

describe('NonTrainingCipetComponent', () => {
  let component: NonTrainingCipetComponent;
  let fixture: ComponentFixture<NonTrainingCipetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingCipetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingCipetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
