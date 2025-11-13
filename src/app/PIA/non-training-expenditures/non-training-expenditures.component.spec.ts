import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTrainingExpendituresComponent } from './non-training-expenditures.component';

describe('NonTrainingExpendituresComponent', () => {
  let component: NonTrainingExpendituresComponent;
  let fixture: ComponentFixture<NonTrainingExpendituresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonTrainingExpendituresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonTrainingExpendituresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
