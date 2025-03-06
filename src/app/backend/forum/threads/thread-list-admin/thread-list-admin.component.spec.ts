import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadListAdminComponent } from './thread-list-admin.component';

describe('ThreadListAdminComponent', () => {
  let component: ThreadListAdminComponent;
  let fixture: ComponentFixture<ThreadListAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreadListAdminComponent]
    });
    fixture = TestBed.createComponent(ThreadListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
