import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsmeCouncellorRegisterationComponent } from './msme-councellor-registeration.component';

describe('MsmeCouncellorRegisterationComponent', () => {
  let component: MsmeCouncellorRegisterationComponent;
  let fixture: ComponentFixture<MsmeCouncellorRegisterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsmeCouncellorRegisterationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsmeCouncellorRegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
