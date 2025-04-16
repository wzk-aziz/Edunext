import { Token } from './token';
import { Role } from './role';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number?: string; 
    authorities: { authority: string }[];
    mfaEnabled: boolean;
    role: string;
    image: string; 
    cvFilePath?: string;
    banned: boolean;
  }
  