import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionToolsComponent } from './interaction-tools.component';

describe('InteractionToolsComponent', () => {
  let component: InteractionToolsComponent;
  let fixture: ComponentFixture<InteractionToolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InteractionToolsComponent]
    });
    fixture = TestBed.createComponent(InteractionToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
