import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMsmeCouncellorDataComponent } from './view-msme-councellor-data.component';

describe('ViewMsmeCouncellorDataComponent', () => {
  let component: ViewMsmeCouncellorDataComponent;
  let fixture: ComponentFixture<ViewMsmeCouncellorDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMsmeCouncellorDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMsmeCouncellorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
