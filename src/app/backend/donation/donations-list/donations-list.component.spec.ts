import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationsListComponent } from './donations-list.component';

describe('DonationsListComponent', () => {
  let component: DonationsListComponent;
  let fixture: ComponentFixture<DonationsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonationsListComponent]
    });
    fixture = TestBed.createComponent(DonationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
