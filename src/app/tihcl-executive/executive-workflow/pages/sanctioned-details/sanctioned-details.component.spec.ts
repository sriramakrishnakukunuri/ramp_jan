import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanctionedDetailsComponent } from './sanctioned-details.component';

describe('SanctionedDetailsComponent', () => {
  let component: SanctionedDetailsComponent;
  let fixture: ComponentFixture<SanctionedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanctionedDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SanctionedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
