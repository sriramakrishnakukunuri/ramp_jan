import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiConcernLetterComponent } from './di-concern-letter.component';

describe('DiConcernLetterComponent', () => {
  let component: DiConcernLetterComponent;
  let fixture: ComponentFixture<DiConcernLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiConcernLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiConcernLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
