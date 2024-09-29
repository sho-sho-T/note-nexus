export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  created_at: string;
}
