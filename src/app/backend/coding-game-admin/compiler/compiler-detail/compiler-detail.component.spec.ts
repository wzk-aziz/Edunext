import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilerDetailComponent } from './compiler-detail.component';

describe('CompilerDetailComponent', () => {
  let component: CompilerDetailComponent;
  let fixture: ComponentFixture<CompilerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompilerDetailComponent]
    });
    fixture = TestBed.createComponent(CompilerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
