import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBackComponent } from './product-back.component';

describe('ProductBackComponent', () => {
  let component: ProductBackComponent;
  let fixture: ComponentFixture<ProductBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductBackComponent]
    });
    fixture = TestBed.createComponent(ProductBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
