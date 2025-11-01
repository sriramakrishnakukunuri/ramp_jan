import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndianRupeesInputComponent } from './indian-rupees-input.component';

describe('IndianRupeesInputComponent', () => {
  let component: IndianRupeesInputComponent;
  let fixture: ComponentFixture<IndianRupeesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndianRupeesInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndianRupeesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
