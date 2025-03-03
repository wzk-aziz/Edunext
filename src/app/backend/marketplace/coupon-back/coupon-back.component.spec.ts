import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponBackComponent } from './coupon-back.component';

describe('CouponBackComponent', () => {
  let component: CouponBackComponent;
  let fixture: ComponentFixture<CouponBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CouponBackComponent]
    });
    fixture = TestBed.createComponent(CouponBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
