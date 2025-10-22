import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNonParticipantsDataComponent } from './add-non-participants-data.component';

describe('AddNonParticipantsDataComponent', () => {
  let component: AddNonParticipantsDataComponent;
  let fixture: ComponentFixture<AddNonParticipantsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNonParticipantsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNonParticipantsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
