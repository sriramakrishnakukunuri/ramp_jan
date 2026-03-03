import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignApplicationsComponent } from './reassign-applications.component';

describe('ReassignApplicationsComponent', () => {
  let component: ReassignApplicationsComponent;
  let fixture: ComponentFixture<ReassignApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReassignApplicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReassignApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
