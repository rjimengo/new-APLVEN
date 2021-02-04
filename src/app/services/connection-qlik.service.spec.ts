import { TestBed } from '@angular/core/testing';

import { ConnectionQlikService } from './connection-qlik.service';

describe('ConnectionQlikService', () => {
  let service: ConnectionQlikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionQlikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
