import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCreationFormComponent } from './quiz-creation-form.component';

describe('QuizCreationFormComponent', () => {
  let component: QuizCreationFormComponent;
  let fixture: ComponentFixture<QuizCreationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizCreationFormComponent]
    });
    fixture = TestBed.createComponent(QuizCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
