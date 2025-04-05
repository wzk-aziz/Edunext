import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureWhiteboardComponent } from './lecture-whiteboard.component';

describe('LectureWhiteboardComponent', () => {
  let component: LectureWhiteboardComponent;
  let fixture: ComponentFixture<LectureWhiteboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LectureWhiteboardComponent]
    });
    fixture = TestBed.createComponent(LectureWhiteboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
