import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationParticipantComponent } from './verification-participant.component';

describe('VerificationParticipantComponent', () => {
  let component: VerificationParticipantComponent;
  let fixture: ComponentFixture<VerificationParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationParticipantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
