import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllAgencySessionsComponent } from './view-all-agency-sessions.component';

describe('ViewAllAgencySessionsComponent', () => {
  let component: ViewAllAgencySessionsComponent;
  let fixture: ComponentFixture<ViewAllAgencySessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllAgencySessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllAgencySessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
