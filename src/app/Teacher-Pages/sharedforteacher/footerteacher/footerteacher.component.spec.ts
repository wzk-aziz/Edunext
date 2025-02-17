import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterteacherComponent } from './footerteacher.component';

describe('FooterteacherComponent', () => {
  let component: FooterteacherComponent;
  let fixture: ComponentFixture<FooterteacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterteacherComponent]
    });
    fixture = TestBed.createComponent(FooterteacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
