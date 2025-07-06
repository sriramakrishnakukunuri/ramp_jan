import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RampChecklistComponent } from './ramp-checklist.component';

describe('RampChecklistComponent', () => {
  let component: RampChecklistComponent;
  let fixture: ComponentFixture<RampChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RampChecklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RampChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
