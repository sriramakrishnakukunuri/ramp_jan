import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAppilicationNewComponent } from './loan-appilication-new.component';

describe('LoanAppilicationNewComponent', () => {
  let component: LoanAppilicationNewComponent;
  let fixture: ComponentFixture<LoanAppilicationNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanAppilicationNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanAppilicationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
