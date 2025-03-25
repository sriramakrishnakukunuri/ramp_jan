import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetOutcomeComponent } from './get-outcome.component';

describe('GetOutcomeComponent', () => {
  let component: GetOutcomeComponent;
  let fixture: ComponentFixture<GetOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetOutcomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
