import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureOutcomeComponent } from './capture-outcome.component';

describe('CaptureOutcomeComponent', () => {
  let component: CaptureOutcomeComponent;
  let fixture: ComponentFixture<CaptureOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureOutcomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptureOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
