import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutamalComponent } from './layoutamal.component';

describe('LayoutamalComponent', () => {
  let component: LayoutamalComponent;
  let fixture: ComponentFixture<LayoutamalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutamalComponent]
    });
    fixture = TestBed.createComponent(LayoutamalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
