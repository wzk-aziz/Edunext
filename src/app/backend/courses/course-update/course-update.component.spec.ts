import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUpdateComponent } from './course-update.component';

describe('CourseUpdateComponent', () => {
  let component: CourseUpdateComponent;
  let fixture: ComponentFixture<CourseUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseUpdateComponent]
    });
    fixture = TestBed.createComponent(CourseUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
