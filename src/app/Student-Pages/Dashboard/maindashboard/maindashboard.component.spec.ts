import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaindashboardComponent } from './maindashboard.component';

describe('MaindashboardComponent', () => {
  let component: MaindashboardComponent;
  let fixture: ComponentFixture<MaindashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaindashboardComponent]
    });
    fixture = TestBed.createComponent(MaindashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
