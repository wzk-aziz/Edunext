import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamstudentdetailsComponent } from './examstudentdetails.component';

describe('ExamstudentdetailsComponent', () => {
  let component: ExamstudentdetailsComponent;
  let fixture: ComponentFixture<ExamstudentdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamstudentdetailsComponent]
    });
    fixture = TestBed.createComponent(ExamstudentdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
