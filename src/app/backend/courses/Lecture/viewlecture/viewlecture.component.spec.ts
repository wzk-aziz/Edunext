import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlectureComponent } from './viewlecture.component';

describe('ViewlectureComponent', () => {
  let component: ViewlectureComponent;
  let fixture: ComponentFixture<ViewlectureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewlectureComponent]
    });
    fixture = TestBed.createComponent(ViewlectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
