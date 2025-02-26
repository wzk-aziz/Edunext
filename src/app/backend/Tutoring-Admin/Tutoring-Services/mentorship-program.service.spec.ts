import { TestBed } from '@angular/core/testing';

import { MentorshipProgramService } from './mentorship-program.service';

describe('MentorshipProgramService', () => {
  let service: MentorshipProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorshipProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
