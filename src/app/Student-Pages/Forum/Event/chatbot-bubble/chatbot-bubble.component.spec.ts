import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotBubbleComponent } from './chatbot-bubble.component';

describe('ChatbotBubbleComponent', () => {
  let component: ChatbotBubbleComponent;
  let fixture: ComponentFixture<ChatbotBubbleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatbotBubbleComponent]
    });
    fixture = TestBed.createComponent(ChatbotBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
