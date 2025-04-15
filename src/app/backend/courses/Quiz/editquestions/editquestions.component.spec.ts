import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditquestionsComponent } from './editquestions.component';

describe('EditquestionsComponent', () => {
  let component: EditquestionsComponent;
  let fixture: ComponentFixture<EditquestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditquestionsComponent]
    });
    fixture = TestBed.createComponent(EditquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
