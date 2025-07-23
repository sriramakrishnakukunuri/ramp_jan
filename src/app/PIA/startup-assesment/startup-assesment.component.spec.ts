import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartupAssesmentComponent } from './startup-assesment.component';

describe('StartupAssesmentComponent', () => {
  let component: StartupAssesmentComponent;
  let fixture: ComponentFixture<StartupAssesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartupAssesmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartupAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
