import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListAdminComponent } from './blog-list-admin.component';

describe('BlogListAdminComponent', () => {
  let component: BlogListAdminComponent;
  let fixture: ComponentFixture<BlogListAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogListAdminComponent]
    });
    fixture = TestBed.createComponent(BlogListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
