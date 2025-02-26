import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeQuizComponent } from './take-quiz.component';

describe('TakeQuizComponent', () => {
  let component: TakeQuizComponent;
  let fixture: ComponentFixture<TakeQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TakeQuizComponent]
    });
    fixture = TestBed.createComponent(TakeQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
