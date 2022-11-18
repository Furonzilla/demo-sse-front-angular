import { TestBed } from '@angular/core/testing';

import { WildersService } from './wilders.service';

describe('WildersService', () => {
  let service: WildersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WildersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
