import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilerFormComponent } from './compiler-form.component';

describe('CompilerFormComponent', () => {
  let component: CompilerFormComponent;
  let fixture: ComponentFixture<CompilerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompilerFormComponent]
    });
    fixture = TestBed.createComponent(CompilerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
