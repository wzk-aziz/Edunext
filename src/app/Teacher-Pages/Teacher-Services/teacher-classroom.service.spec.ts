import { TestBed } from '@angular/core/testing';

import { TeacherClassroomService } from './teacher-classroom.service';

describe('TeacherClassroomService', () => {
  let service: TeacherClassroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherClassroomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
