import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSessionReviewComponent } from './teacher-session-review.component';

describe('TeacherSessionReviewComponent', () => {
  let component: TeacherSessionReviewComponent;
  let fixture: ComponentFixture<TeacherSessionReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherSessionReviewComponent]
    });
    fixture = TestBed.createComponent(TeacherSessionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
