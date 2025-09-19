import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SAPreliminaryComponent } from './sa-preliminary.component';

describe('SAPreliminaryComponent', () => {
  let component: SAPreliminaryComponent;
  let fixture: ComponentFixture<SAPreliminaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SAPreliminaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SAPreliminaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
