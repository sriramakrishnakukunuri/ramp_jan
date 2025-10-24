import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputProgressComponent } from './output-progress.component';

describe('OutputProgressComponent', () => {
  let component: OutputProgressComponent;
  let fixture: ComponentFixture<OutputProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
