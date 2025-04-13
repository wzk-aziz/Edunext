import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAnalyticsComponent } from './order-analytics.component';

describe('OrderAnalyticsComponent', () => {
  let component: OrderAnalyticsComponent;
  let fixture: ComponentFixture<OrderAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderAnalyticsComponent]
    });
    fixture = TestBed.createComponent(OrderAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
