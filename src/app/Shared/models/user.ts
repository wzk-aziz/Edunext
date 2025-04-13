import { Token } from './token';
import { Role } from './role';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  authorities: { authority: string }[];
  mfaEnabled: boolean;
  role: string; // un seul rôle final retenu (string simple, ou à adapter selon ton modèle de rôles)
  image: string; // utilisé dans le HTML
  cvFilePath?: string;
  banned?: boolean; // ajouté s’il est nécessaire, sinon tu peux le retirer
}
