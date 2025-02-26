import { TestBed } from '@angular/core/testing';

import { ProgressReportService } from './progress-report.service';

describe('ProgressReportService', () => {
  let service: ProgressReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
