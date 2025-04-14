import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramExpenditureComponent } from './program-expenditure.component';

describe('ProgramExpenditureComponent', () => {
  let component: ProgramExpenditureComponent;
  let fixture: ComponentFixture<ProgramExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramExpenditureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
