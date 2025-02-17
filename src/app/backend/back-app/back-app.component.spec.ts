import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackAppComponent } from './back-app.component';

describe('BackAppComponent', () => {
  let component: BackAppComponent;
  let fixture: ComponentFixture<BackAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackAppComponent]
    });
    fixture = TestBed.createComponent(BackAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
