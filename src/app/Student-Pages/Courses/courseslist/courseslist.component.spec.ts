import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseslistComponent } from './courseslist.component';

describe('CourseslistComponent', () => {
  let component: CourseslistComponent;
  let fixture: ComponentFixture<CourseslistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseslistComponent]
    });
    fixture = TestBed.createComponent(CourseslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
