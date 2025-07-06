import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingApplicationExecutiveComponent } from './pending-application-executive.component';

describe('PendingApplicationExecutiveComponent', () => {
  let component: PendingApplicationExecutiveComponent;
  let fixture: ComponentFixture<PendingApplicationExecutiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingApplicationExecutiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingApplicationExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
