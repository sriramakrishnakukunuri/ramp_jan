import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrganizationListComponent } from './view-organization-list.component';

describe('ViewOrganizationListComponent', () => {
  let component: ViewOrganizationListComponent;
  let fixture: ComponentFixture<ViewOrganizationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOrganizationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOrganizationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
