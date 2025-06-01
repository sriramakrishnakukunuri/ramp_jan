import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllAgencyCompletedComponent } from './view-all-agency-completed.component';

describe('ViewAllAgencyCompletedComponent', () => {
  let component: ViewAllAgencyCompletedComponent;
  let fixture: ComponentFixture<ViewAllAgencyCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllAgencyCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllAgencyCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
