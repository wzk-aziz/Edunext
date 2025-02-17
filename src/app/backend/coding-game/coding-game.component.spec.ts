import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingGameComponent } from './coding-game.component';

describe('CodingGameComponent', () => {
  let component: CodingGameComponent;
  let fixture: ComponentFixture<CodingGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodingGameComponent]
    });
    fixture = TestBed.createComponent(CodingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
