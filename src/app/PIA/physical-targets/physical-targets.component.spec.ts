import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalTargetsComponent } from './physical-targets.component';

describe('PhysicalTargetsComponent', () => {
  let component: PhysicalTargetsComponent;
  let fixture: ComponentFixture<PhysicalTargetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalTargetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysicalTargetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
