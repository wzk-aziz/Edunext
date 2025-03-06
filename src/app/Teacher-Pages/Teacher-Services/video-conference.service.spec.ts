import { TestBed } from '@angular/core/testing';

import { VideoConferenceService } from './video-conference.service';

describe('VideoConferenceService', () => {
  let service: VideoConferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoConferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
