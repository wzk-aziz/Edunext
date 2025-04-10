import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBackComponent } from './order-back.component';

describe('OrderBackComponent', () => {
  let component: OrderBackComponent;
  let fixture: ComponentFixture<OrderBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderBackComponent]
    });
    fixture = TestBed.createComponent(OrderBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
