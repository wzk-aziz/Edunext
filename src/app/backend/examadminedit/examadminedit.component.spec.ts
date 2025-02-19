import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamadmineditComponent } from './examadminedit.component';

describe('ExamadmineditComponent', () => {
  let component: ExamadmineditComponent;
  let fixture: ComponentFixture<ExamadmineditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamadmineditComponent]
    });
    fixture = TestBed.createComponent(ExamadmineditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
