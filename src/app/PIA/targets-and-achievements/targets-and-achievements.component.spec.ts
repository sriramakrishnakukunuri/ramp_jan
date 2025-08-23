import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetsAndAchievementsComponent } from './targets-and-achievements.component';

describe('TargetsAndAchievementsComponent', () => {
  let component: TargetsAndAchievementsComponent;
  let fixture: ComponentFixture<TargetsAndAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetsAndAchievementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetsAndAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
