import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureCreationFromComponent } from './lecture-creation-from.component';

describe('LectureCreationFromComponent', () => {
  let component: LectureCreationFromComponent;
  let fixture: ComponentFixture<LectureCreationFromComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LectureCreationFromComponent]
    });
    fixture = TestBed.createComponent(LectureCreationFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
