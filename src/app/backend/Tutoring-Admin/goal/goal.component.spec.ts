import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalComponent } from './goal.component';

describe('GoalComponent', () => {
  let component: GoalComponent;
  let fixture: ComponentFixture<GoalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoalComponent]
    });
    fixture = TestBed.createComponent(GoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
