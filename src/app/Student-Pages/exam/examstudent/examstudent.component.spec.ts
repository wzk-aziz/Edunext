import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamstudentComponent } from './examstudent.component';

describe('ExamstudentComponent', () => {
  let component: ExamstudentComponent;
  let fixture: ComponentFixture<ExamstudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamstudentComponent]
    });
    fixture = TestBed.createComponent(ExamstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
