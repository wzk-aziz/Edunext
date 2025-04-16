export interface AuthenticationResponse {
    accessToken?: string;
    mfaEnabled?: boolean;
    secretImageUri?: string;
    role?: string;
    userId?: number;      
    user?: {          // Add user details if your backend provides them
      id?: number;
      email?: string;
      firstname?: string;
      lastname?: string;
      image?: string;
    };
  }