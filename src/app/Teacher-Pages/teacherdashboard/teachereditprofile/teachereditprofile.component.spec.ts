import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachereditprofileComponent } from './teachereditprofile.component';

describe('TeachereditprofileComponent', () => {
  let component: TeachereditprofileComponent;
  let fixture: ComponentFixture<TeachereditprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeachereditprofileComponent]
    });
    fixture = TestBed.createComponent(TeachereditprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
