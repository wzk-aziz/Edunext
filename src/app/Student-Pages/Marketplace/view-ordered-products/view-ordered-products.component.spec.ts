import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderedProductsComponent } from './view-ordered-products.component';

describe('ViewOrderedProductsComponent', () => {
  let component: ViewOrderedProductsComponent;
  let fixture: ComponentFixture<ViewOrderedProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewOrderedProductsComponent]
    });
    fixture = TestBed.createComponent(ViewOrderedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
