import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherVirtualClassroomsComponent } from './teacher-virtual-classrooms.component';

describe('TeacherVirtualClassroomsComponent', () => {
  let component: TeacherVirtualClassroomsComponent;
  let fixture: ComponentFixture<TeacherVirtualClassroomsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherVirtualClassroomsComponent]
    });
    fixture = TestBed.createComponent(TeacherVirtualClassroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
