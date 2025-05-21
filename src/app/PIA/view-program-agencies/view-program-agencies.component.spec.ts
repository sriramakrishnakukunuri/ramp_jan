import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgramAgenciesComponent } from './view-program-agencies.component';

describe('ViewProgramAgenciesComponent', () => {
  let component: ViewProgramAgenciesComponent;
  let fixture: ComponentFixture<ViewProgramAgenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProgramAgenciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProgramAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
