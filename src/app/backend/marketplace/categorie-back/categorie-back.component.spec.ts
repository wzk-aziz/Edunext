import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieBackComponent } from './categorie-back.component';

describe('CategorieBackComponent', () => {
  let component: CategorieBackComponent;
  let fixture: ComponentFixture<CategorieBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieBackComponent]
    });
    fixture = TestBed.createComponent(CategorieBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
