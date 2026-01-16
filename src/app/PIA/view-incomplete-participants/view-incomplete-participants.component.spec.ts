import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIncompleteParticipantsComponent } from './view-incomplete-participants.component';

describe('ViewIncompleteParticipantsComponent', () => {
  let component: ViewIncompleteParticipantsComponent;
  let fixture: ComponentFixture<ViewIncompleteParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIncompleteParticipantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewIncompleteParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
