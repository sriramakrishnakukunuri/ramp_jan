import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureOutcomeDynamicComponent } from './capture-outcome-dynamic.component';

describe('CaptureOutcomeDynamicComponent', () => {
  let component: CaptureOutcomeDynamicComponent;
  let fixture: ComponentFixture<CaptureOutcomeDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureOutcomeDynamicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptureOutcomeDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
