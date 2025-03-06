
export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    SUSPENDED = 'SUSPENDED',
    LOCKED = 'LOCKED'
  }
  
  export interface UserStatusInfo {
    status: UserStatus;
    lastLoginDate?: Date;
    lastStatusChange?: Date;
    statusReason?: string;
    loginAttempts?: number;
    maxLoginAttempts?: number;
  }
  
  export class UserStatusModel {
    email: string;
    statusInfo: UserStatusInfo;
    
    constructor(email: string, status: UserStatus = UserStatus.ACTIVE) {
      this.email = email;
      this.statusInfo = {
        status: status,
        lastLoginDate: new Date(),
        lastStatusChange: new Date(),
        loginAttempts: 0,
        maxLoginAttempts: 5
      };
    }
    
    isActive(): boolean {
      return this.statusInfo.status === UserStatus.ACTIVE;
    }
    
    isPending(): boolean {
      return this.statusInfo.status === UserStatus.PENDING;
    }
    
    incrementLoginAttempt(): number {
      if (this.statusInfo.loginAttempts !== undefined) {
        this.statusInfo.loginAttempts += 1;
        
        // Auto-lock account if max attempts reached
        if (this.statusInfo.maxLoginAttempts && 
            this.statusInfo.loginAttempts >= this.statusInfo.maxLoginAttempts) {
          this.statusInfo.status = UserStatus.LOCKED;
          this.statusInfo.statusReason = 'Maximum login attempts exceeded';
          this.statusInfo.lastStatusChange = new Date();
        }
        
        return this.statusInfo.loginAttempts;
      }
      return 0;
    }
    
    resetLoginAttempts(): void {
      if (this.statusInfo.loginAttempts !== undefined) {
        this.statusInfo.loginAttempts = 0;
      }
    }
    
    updateStatus(newStatus: UserStatus, reason?: string): void {
      this.statusInfo.status = newStatus;
      this.statusInfo.statusReason = reason;
      this.statusInfo.lastStatusChange = new Date();
    }
    
    updateLastLogin(): void {
      this.statusInfo.lastLoginDate = new Date();
      this.resetLoginAttempts();
    }
    
    getStatusForEmail(): string {
      // Format for email templates
      return `User ${this.email} is currently ${this.statusInfo.status}${this.statusInfo.statusReason ? ` (Reason: ${this.statusInfo.statusReason})` : ''}`;
    }
  }