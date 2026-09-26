export interface AuthUser {
  id: string;

  username: string;

  full_name: string;

  role: string;
}

export interface LoginPayload {
  username: string;

  password: string;
}
