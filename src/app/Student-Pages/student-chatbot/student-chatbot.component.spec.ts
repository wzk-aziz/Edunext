import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentChatbotComponent } from './student-chatbot.component';

describe('StudentChatbotComponent', () => {
  let component: StudentChatbotComponent;
  let fixture: ComponentFixture<StudentChatbotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentChatbotComponent]
    });
    fixture = TestBed.createComponent(StudentChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
