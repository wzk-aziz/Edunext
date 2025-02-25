import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureupdateComponent } from './lectureupdate.component';

describe('LectureupdateComponent', () => {
  let component: LectureupdateComponent;
  let fixture: ComponentFixture<LectureupdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LectureupdateComponent]
    });
    fixture = TestBed.createComponent(LectureupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
