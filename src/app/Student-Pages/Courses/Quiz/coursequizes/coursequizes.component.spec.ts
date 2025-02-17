import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursequizesComponent } from './coursequizes.component';

describe('CoursequizesComponent', () => {
  let component: CoursequizesComponent;
  let fixture: ComponentFixture<CoursequizesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursequizesComponent]
    });
    fixture = TestBed.createComponent(CoursequizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
