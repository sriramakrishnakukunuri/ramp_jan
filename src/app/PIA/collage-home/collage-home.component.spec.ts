import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollageHomeComponent } from './collage-home.component';

describe('CollageHomeComponent', () => {
  let component: CollageHomeComponent;
  let fixture: ComponentFixture<CollageHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollageHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
