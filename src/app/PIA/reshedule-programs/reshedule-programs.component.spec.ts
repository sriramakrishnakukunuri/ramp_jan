import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResheduleProgramsComponent } from './reshedule-programs.component';

describe('ResheduleProgramsComponent', () => {
  let component: ResheduleProgramsComponent;
  let fixture: ComponentFixture<ResheduleProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResheduleProgramsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResheduleProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
