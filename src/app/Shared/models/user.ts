import { Token } from './token';
import { Role } from './role';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    authorities: { authority: string }[];
    mfaEnabled: boolean;
    roles: String;
    image: string; // Ensure the property name matches the one used in the HTML template
    cvFilePath?: string;
}
