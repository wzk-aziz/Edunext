import { TestBed } from '@angular/core/testing';

import { FeedBackService } from './feed-back.service';

describe('FeedBackService', () => {
  let service: FeedBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
