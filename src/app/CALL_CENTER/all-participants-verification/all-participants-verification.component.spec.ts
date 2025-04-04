import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllParticipantsVerificationComponent } from './all-participants-verification.component';

describe('AllParticipantsVerificationComponent', () => {
  let component: AllParticipantsVerificationComponent;
  let fixture: ComponentFixture<AllParticipantsVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllParticipantsVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllParticipantsVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
