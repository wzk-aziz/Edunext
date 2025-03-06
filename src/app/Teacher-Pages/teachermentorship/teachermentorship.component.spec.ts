import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMentorshipComponent } from './teachermentorship.component';

describe('TeachermentorshipComponent', () => {
  let component: TeacherMentorshipComponent;
  let fixture: ComponentFixture<TeacherMentorshipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherMentorshipComponent]
    });
    fixture = TestBed.createComponent(TeacherMentorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
