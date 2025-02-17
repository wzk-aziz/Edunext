import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStorageComponent } from './file-storage.component';

describe('FileStorageComponent', () => {
  let component: FileStorageComponent;
  let fixture: ComponentFixture<FileStorageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileStorageComponent]
    });
    fixture = TestBed.createComponent(FileStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
