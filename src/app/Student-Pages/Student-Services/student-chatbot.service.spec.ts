import { TestBed } from '@angular/core/testing';

import { StudentChatbotService } from './student-chatbot.service';

describe('StudentChatbotService', () => {
  let service: StudentChatbotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentChatbotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
