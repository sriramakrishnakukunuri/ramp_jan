import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollageCreationComponent } from './collage-creation.component';

describe('CollageCreationComponent', () => {
  let component: CollageCreationComponent;
  let fixture: ComponentFixture<CollageCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollageCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollageCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
