import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilerListComponent } from './compiler-list.component';

describe('CompilerListComponent', () => {
  let component: CompilerListComponent;
  let fixture: ComponentFixture<CompilerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompilerListComponent]
    });
    fixture = TestBed.createComponent(CompilerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
