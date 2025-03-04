import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentVirtualClassroomSessionsComponent } from './student-virtual-classroom-sessions.component';

describe('StudentVirtualClassroomSessionsComponent', () => {
  let component: StudentVirtualClassroomSessionsComponent;
  let fixture: ComponentFixture<StudentVirtualClassroomSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentVirtualClassroomSessionsComponent]
    });
    fixture = TestBed.createComponent(StudentVirtualClassroomSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
