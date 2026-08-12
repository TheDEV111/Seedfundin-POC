import { User, AccountType } from './api-client';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setStoredToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

export function clearStoredToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

// Generate a dummy Supabase JWT token for MVP demonstration
export function createDemoJWT(email: string, accountType: AccountType, name: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: `usr_${Math.random().toString(36).substring(2, 9)}`,
    email,
    user_metadata: {
      name,
      account_type: accountType,
    },
    exp: Math.floor(Date.now() / 1000) + (86400 * 30),
  }));
  const signature = 'demo_signature';
  return `${header}.${payload}.${signature}`;
}

export function parseStoredToken(token: string) {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    return JSON.parse(atob(payloadBase64));
  } catch {
    return null;
  }
}
