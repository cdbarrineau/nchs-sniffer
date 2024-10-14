import { TestBed } from '@angular/core/testing';

import { NchsSnifferService } from './nchs-sniffer.service';

describe('NchsSnifferService', () => {
  let service: NchsSnifferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NchsSnifferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
