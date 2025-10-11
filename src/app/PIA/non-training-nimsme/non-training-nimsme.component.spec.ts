import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingNimsmeComponent } from './non-training-nimsme.component';

describe('NonTrainingNimsmeComponent', () => {
  let component: NonTrainingNimsmeComponent;
  let fixture: ComponentFixture<NonTrainingNimsmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingNimsmeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingNimsmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
