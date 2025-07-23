import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCounsellorComponent } from './assign-counsellor.component';

describe('AssignCounsellorComponent', () => {
  let component: AssignCounsellorComponent;
  let fixture: ComponentFixture<AssignCounsellorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCounsellorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCounsellorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
