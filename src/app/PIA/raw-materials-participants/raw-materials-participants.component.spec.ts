import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialsParticipantsComponent } from './raw-materials-participants.component';

describe('RawMaterialsParticipantsComponent', () => {
  let component: RawMaterialsParticipantsComponent;
  let fixture: ComponentFixture<RawMaterialsParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialsParticipantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMaterialsParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
