import { TestBed } from '@angular/core/testing';

import { ActiveUserService } from './activeUser.service';

describe('ActiveUserService', () => {
  let service: ActiveUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
