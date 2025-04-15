import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertifadmineditComponent } from './certifadminedit.component';

describe('CertifadmineditComponent', () => {
  let component: CertifadmineditComponent;
  let fixture: ComponentFixture<CertifadmineditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertifadmineditComponent]
    });
    fixture = TestBed.createComponent(CertifadmineditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
