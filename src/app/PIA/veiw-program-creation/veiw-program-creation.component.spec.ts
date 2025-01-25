import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeiwProgramCreationComponent } from './veiw-program-creation.component';

describe('VeiwProgramCreationComponent', () => {
  let component: VeiwProgramCreationComponent;
  let fixture: ComponentFixture<VeiwProgramCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VeiwProgramCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeiwProgramCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
