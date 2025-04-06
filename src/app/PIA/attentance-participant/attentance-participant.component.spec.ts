import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttentanceParticipantComponent } from './attentance-participant.component';

describe('AttentanceParticipantComponent', () => {
  let component: AttentanceParticipantComponent;
  let fixture: ComponentFixture<AttentanceParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttentanceParticipantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttentanceParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
