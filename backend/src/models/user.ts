import { User } from "../types";

// TODO: ORMを使用するようにしたい

export const create = async (
  db: D1Database,
  username: string,
  password: string
): Promise<User> => {
  const existingUser = await db
    .prepare("SELECT * FROM users WHERE username = ?")
    .bind(username)
    .first();

  if (existingUser) {
    throw new Error("このユーザーはすでに登録されています。");
  }

  const result = await db
    .prepare(
      "INSERT INTO users (username, password_hash) VALUES (?, ?) RETURNING *"
    )
    .bind(username, password)
    .first<User>();

  if (!result) {
    throw new Error("ユーザーの作成に失敗しました。");
  }

  return result;
};

export const findById = async (
  db: D1Database,
  userId: number
): Promise<User | null> => {
  return await db
    .prepare("SELECT * FROM users WHERE user_id = ?")
    .bind(userId)
    .first();
};

export const findByUsername = async (
  db: D1Database,
  username: string
): Promise<User | null> => {
  return await db
    .prepare("SELECT * FROM users WHERE username = ?")
    .bind(username)
    .first();
};

export const update = async (
  db: D1Database,
  userId: number,
  username?: string,
  password?: string
): Promise<User | null> => {
  let updateQuery = "UPDATE users SET ";
  const updateValues = [];

  if (username) {
    updateQuery += "username = ?, ";
    updateValues.push(username);
  }

  if (password) {
    updateQuery += "password_hash = ?, ";
    updateValues.push(password);
  }

  updateQuery = updateQuery.slice(0, -2) + " WHERE user_id = ?";
  updateValues.push(userId);

  const result = await db
    .prepare(updateQuery)
    .bind(...updateValues)
    .run();
  if (!result.success) {
    return null;
  }

  return await findById(db, userId);
};

export const remove = async (
  db: D1Database,
  userId: number
): Promise<boolean> => {
  const result = await db
    .prepare("DELETE FROM users WHERE user_id = ?")
    .bind(userId)
    .run();
  return result.success;
};
