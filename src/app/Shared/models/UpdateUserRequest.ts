export interface UpdateUserRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    mfaEnabled: boolean;
  }