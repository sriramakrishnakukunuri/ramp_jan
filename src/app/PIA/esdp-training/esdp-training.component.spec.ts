import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESDPTrainingComponent } from './esdp-training.component';

describe('ESDPTrainingComponent', () => {
  let component: ESDPTrainingComponent;
  let fixture: ComponentFixture<ESDPTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ESDPTrainingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ESDPTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
