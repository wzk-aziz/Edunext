import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionStatsComponent } from './submission-stats.component';

describe('SubmissionStatsComponent', () => {
  let component: SubmissionStatsComponent;
  let fixture: ComponentFixture<SubmissionStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmissionStatsComponent]
    });
    fixture = TestBed.createComponent(SubmissionStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
