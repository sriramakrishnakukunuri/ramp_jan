import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingProgressWehubComponent } from './non-training-progress-wehub.component';

describe('NonTrainingProgressWehubComponent', () => {
  let component: NonTrainingProgressWehubComponent;
  let fixture: ComponentFixture<NonTrainingProgressWehubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingProgressWehubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingProgressWehubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
