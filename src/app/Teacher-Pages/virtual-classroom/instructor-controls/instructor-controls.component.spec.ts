import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorControlsComponent } from './instructor-controls.component';

describe('InstructorControlsComponent', () => {
  let component: InstructorControlsComponent;
  let fixture: ComponentFixture<InstructorControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorControlsComponent]
    });
    fixture = TestBed.createComponent(InstructorControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
