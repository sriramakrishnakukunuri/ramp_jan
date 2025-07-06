import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApplicationExecutiveComponent } from './new-application-executive.component';

describe('NewApplicationExecutiveComponent', () => {
  let component: NewApplicationExecutiveComponent;
  let fixture: ComponentFixture<NewApplicationExecutiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewApplicationExecutiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewApplicationExecutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
