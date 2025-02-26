import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipPorgramComponent } from './mentorship-porgram.component';

describe('MentorshipPorgramComponent', () => {
  let component: MentorshipPorgramComponent;
  let fixture: ComponentFixture<MentorshipPorgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MentorshipPorgramComponent]
    });
    fixture = TestBed.createComponent(MentorshipPorgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
