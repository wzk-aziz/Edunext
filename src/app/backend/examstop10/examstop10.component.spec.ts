import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Examstop10Component } from './examstop10.component';

describe('Examstop10Component', () => {
  let component: Examstop10Component;
  let fixture: ComponentFixture<Examstop10Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Examstop10Component]
    });
    fixture = TestBed.createComponent(Examstop10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
