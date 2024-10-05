export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface JWTPayload {
  userId: number;
  exp: number; // 有効期限
}
