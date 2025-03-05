import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTutoringComponent } from './student-tutoring.component';

describe('StudentTutoringComponent', () => {
  let component: StudentTutoringComponent;
  let fixture: ComponentFixture<StudentTutoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTutoringComponent]
    });
    fixture = TestBed.createComponent(StudentTutoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
