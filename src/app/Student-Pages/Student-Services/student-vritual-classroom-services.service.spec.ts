import { TestBed } from '@angular/core/testing';

import { StudentVirtualClassroomService } from './student-vritual-classroom-services.service';
describe('StudentVirtualClassroomService', () => {
  let service: StudentVirtualClassroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentVirtualClassroomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});