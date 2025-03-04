import { TestBed } from '@angular/core/testing';

import { StudentVritualClassroomServicesService } from './student-vritual-classroom-services.service';

describe('StudentVritualClassroomServicesService', () => {
  let service: StudentVritualClassroomServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentVritualClassroomServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
