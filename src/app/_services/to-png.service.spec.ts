import { TestBed } from '@angular/core/testing';

import { ToPngService } from './to-png.service';

describe('ToPngService', () => {
  let service: ToPngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToPngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
