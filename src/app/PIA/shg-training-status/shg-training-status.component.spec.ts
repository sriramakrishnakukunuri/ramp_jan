import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShgTrainingStatusComponent } from './shg-training-status.component';

describe('ShgTrainingStatusComponent', () => {
  let component: ShgTrainingStatusComponent;
  let fixture: ComponentFixture<ShgTrainingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShgTrainingStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShgTrainingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
