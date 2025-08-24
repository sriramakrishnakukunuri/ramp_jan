import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgramsSeperateComponent } from './view-programs-seperate.component';

describe('ViewProgramsSeperateComponent', () => {
  let component: ViewProgramsSeperateComponent;
  let fixture: ComponentFixture<ViewProgramsSeperateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProgramsSeperateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProgramsSeperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
