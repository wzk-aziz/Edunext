import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OAuth2RedirectComponent } from './oauth2-redirect.component';

describe('OAuth2RedirectComponent', () => {
  let component: OAuth2RedirectComponent;
  let fixture: ComponentFixture<OAuth2RedirectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OAuth2RedirectComponent]
    });
    fixture = TestBed.createComponent(OAuth2RedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
