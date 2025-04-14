
export interface AuthenticationResponse {
    accessToken?: string;
    mfaEnabled?: boolean;
    secretImageUri?: string;
    first_name?: string;
  last_name?: string;
  email_address?: string;
    role?: string; 
    userId: number;
    
}