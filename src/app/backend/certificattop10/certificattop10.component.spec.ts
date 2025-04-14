import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Certificattop10Component } from './certificattop10.component';

describe('Certificattop10Component', () => {
  let component: Certificattop10Component;
  let fixture: ComponentFixture<Certificattop10Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Certificattop10Component]
    });
    fixture = TestBed.createComponent(Certificattop10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
