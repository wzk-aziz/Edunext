import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandigpageComponent } from './landigpage.component';

describe('LandigpageComponent', () => {
  let component: LandigpageComponent;
  let fixture: ComponentFixture<LandigpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandigpageComponent]
    });
    fixture = TestBed.createComponent(LandigpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
