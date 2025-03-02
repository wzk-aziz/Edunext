import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePanelComponent } from './resource-panel.component';

describe('ResourcePanelComponent', () => {
  let component: ResourcePanelComponent;
  let fixture: ComponentFixture<ResourcePanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcePanelComponent]
    });
    fixture = TestBed.createComponent(ResourcePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
