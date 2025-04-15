import { Component } from '@angular/core';
import { AlertData, GlobalAlertService } from '../Service/global-alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-global-alert',
  templateUrl: './global-alert.component.html',
  styleUrls: ['./global-alert.component.css']
})
export class GlobalAlertComponent {
  showModal = false;
  alertData: AlertData = { message: '' };
  private subscription!: Subscription;

  constructor(private alertService: GlobalAlertService) {}

  ngOnInit(): void {
    // Subscribe to alert$ from the service
    this.subscription = this.alertService.alert$.subscribe((data) => {
      this.alertData = data;
      this.showModal = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Called when user clicks OK (or Close) button
  onOk(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.showModal) {
      this.showModal = false;
      if (this.alertData.isConfirm && this.alertData.onConfirm) {
        this.alertData.onConfirm();
      }
    }
  }

  // Called when user clicks Cancel button
  onCancel(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.showModal) {
      this.showModal = false;
      if (this.alertData.isConfirm && this.alertData.onCancel) {
        this.alertData.onCancel();
      }
    }
  }

  onBackdropClick(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showModal = false;
  
    // If it's a confirm dialog, treat as Cancel
    if (this.alertData.isConfirm && this.alertData.onCancel) {
      this.alertData.onCancel();
    }
  }
  
}
