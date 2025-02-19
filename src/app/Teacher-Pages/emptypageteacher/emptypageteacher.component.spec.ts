import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptypageteacherComponent } from './emptypageteacher.component';

describe('EmptypageteacherComponent', () => {
  let component: EmptypageteacherComponent;
  let fixture: ComponentFixture<EmptypageteacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmptypageteacherComponent]
    });
    fixture = TestBed.createComponent(EmptypageteacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
