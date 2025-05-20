export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'worker';
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}