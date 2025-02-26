import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuizzesComponent } from './student-quizzes.component';

describe('StudentQuizzesComponent', () => {
  let component: StudentQuizzesComponent;
  let fixture: ComponentFixture<StudentQuizzesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentQuizzesComponent]
    });
    fixture = TestBed.createComponent(StudentQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
