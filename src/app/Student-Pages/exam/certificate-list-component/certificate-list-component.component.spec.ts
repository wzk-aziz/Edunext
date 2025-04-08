import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateListComponentComponent } from './certificate-list-component.component';

describe('CertificateListComponentComponent', () => {
  let component: CertificateListComponentComponent;
  let fixture: ComponentFixture<CertificateListComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificateListComponentComponent]
    });
    fixture = TestBed.createComponent(CertificateListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
