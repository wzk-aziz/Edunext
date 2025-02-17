import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherlandingpageComponent } from './teacherlandingpage.component';

describe('TeacherlandingpageComponent', () => {
  let component: TeacherlandingpageComponent;
  let fixture: ComponentFixture<TeacherlandingpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherlandingpageComponent]
    });
    fixture = TestBed.createComponent(TeacherlandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
