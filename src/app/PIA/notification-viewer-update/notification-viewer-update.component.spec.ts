import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationViewerUpdateComponent } from './notification-viewer-update.component';

describe('NotificationViewerUpdateComponent', () => {
  let component: NotificationViewerUpdateComponent;
  let fixture: ComponentFixture<NotificationViewerUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationViewerUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationViewerUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
