export interface AuthenticationResponse {
    accessToken?: string;
    mfaEnabled?: boolean;
    secretImageUri?: string;
    role?: string; // Add this line
}
