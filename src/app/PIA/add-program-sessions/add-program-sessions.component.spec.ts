import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProgramSessionsComponent } from './add-program-sessions.component';

describe('AddProgramSessionsComponent', () => {
  let component: AddProgramSessionsComponent;
  let fixture: ComponentFixture<AddProgramSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProgramSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProgramSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
