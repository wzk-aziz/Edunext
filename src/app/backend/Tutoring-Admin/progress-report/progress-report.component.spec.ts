import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressReportComponent } from './progress-report.component';

describe('ProgressReportComponent', () => {
  let component: ProgressReportComponent;
  let fixture: ComponentFixture<ProgressReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressReportComponent]
    });
    fixture = TestBed.createComponent(ProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
