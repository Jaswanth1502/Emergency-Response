export type UserRole = 'ADMIN' | 'OPERATOR' | 'ANALYST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  agency: string;
  lastActive: string;
}
