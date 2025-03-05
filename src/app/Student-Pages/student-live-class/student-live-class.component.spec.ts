import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLiveClassComponent } from './student-live-class.component';

describe('StudentLiveClassComponent', () => {
  let component: StudentLiveClassComponent;
  let fixture: ComponentFixture<StudentLiveClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentLiveClassComponent]
    });
    fixture = TestBed.createComponent(StudentLiveClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
