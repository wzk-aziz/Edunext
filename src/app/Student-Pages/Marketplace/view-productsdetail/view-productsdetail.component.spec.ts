import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductsdetailComponent } from './view-productsdetail.component';

describe('ViewProductsdetailComponent', () => {
  let component: ViewProductsdetailComponent;
  let fixture: ComponentFixture<ViewProductsdetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProductsdetailComponent]
    });
    fixture = TestBed.createComponent(ViewProductsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
