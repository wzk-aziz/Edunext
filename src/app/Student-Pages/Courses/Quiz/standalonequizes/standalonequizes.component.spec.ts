import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandalonequizesComponent } from './standalonequizes.component';

describe('StandalonequizesComponent', () => {
  let component: StandalonequizesComponent;
  let fixture: ComponentFixture<StandalonequizesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandalonequizesComponent]
    });
    fixture = TestBed.createComponent(StandalonequizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
