import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderteacherComponent } from './headerteacher.component';

describe('HeaderteacherComponent', () => {
  let component: HeaderteacherComponent;
  let fixture: ComponentFixture<HeaderteacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderteacherComponent]
    });
    fixture = TestBed.createComponent(HeaderteacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
