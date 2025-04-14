import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamstudentsubmitComponent } from './examstudentsubmit.component';

describe('ExamstudentsubmitComponent', () => {
  let component: ExamstudentsubmitComponent;
  let fixture: ComponentFixture<ExamstudentsubmitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamstudentsubmitComponent]
    });
    fixture = TestBed.createComponent(ExamstudentsubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
