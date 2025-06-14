import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllProgramsRelatedDataComponent } from './view-all-programs-related-data.component';

describe('ViewAllProgramsRelatedDataComponent', () => {
  let component: ViewAllProgramsRelatedDataComponent;
  let fixture: ComponentFixture<ViewAllProgramsRelatedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllProgramsRelatedDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllProgramsRelatedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
