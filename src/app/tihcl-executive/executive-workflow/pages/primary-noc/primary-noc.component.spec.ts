import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryNocComponent } from './primary-noc.component';

describe('PrimaryNocComponent', () => {
  let component: PrimaryNocComponent;
  let fixture: ComponentFixture<PrimaryNocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryNocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
