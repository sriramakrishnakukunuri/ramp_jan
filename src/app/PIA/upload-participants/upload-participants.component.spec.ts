import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadParticipantsComponent } from './upload-participants.component';

describe('UploadParticipantsComponent', () => {
  let component: UploadParticipantsComponent;
  let fixture: ComponentFixture<UploadParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadParticipantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
