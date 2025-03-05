import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageDetailComponent } from './language-detail.component';

describe('LanguageDetailComponent', () => {
  let component: LanguageDetailComponent;
  let fixture: ComponentFixture<LanguageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageDetailComponent]
    });
    fixture = TestBed.createComponent(LanguageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
