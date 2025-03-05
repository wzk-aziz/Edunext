import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageFormComponent } from './language-form.component';

describe('LanguageFormComponent', () => {
  let component: LanguageFormComponent;
  let fixture: ComponentFixture<LanguageFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageFormComponent]
    });
    fixture = TestBed.createComponent(LanguageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
