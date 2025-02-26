import { Token } from './token';
import { Role } from './role';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    authorities: { authority: string }[];
    mfaEnabled: boolean;
  }
  