import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteTakingComponent } from './note-taking.component';

describe('NoteTakingComponent', () => {
  let component: NoteTakingComponent;
  let fixture: ComponentFixture<NoteTakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoteTakingComponent]
    });
    fixture = TestBed.createComponent(NoteTakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
