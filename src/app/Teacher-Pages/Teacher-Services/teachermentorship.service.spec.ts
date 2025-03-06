import { TestBed } from '@angular/core/testing';

import { TeachermentorshipService } from './teachermentorship.service';

describe('TeachermentorshipService', () => {
  let service: TeachermentorshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeachermentorshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
