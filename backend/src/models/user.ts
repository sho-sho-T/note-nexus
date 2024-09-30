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
    .prepare("SELECT * FROM users WHERE id = ?")
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
  const updateFields = [];
  const updateValues = [];

  if (username) {
    updateFields.push("username = ?");
    updateValues.push(username);
  }

  if (password) {
    updateFields.push("password_hash = ?");
    updateValues.push(password);
  }

  // 更新するフィールドがない場合return
  if (updateFields.length === 0) {
    return await findById(db, userId);
  }

  // updated_at フィールドの更新を追加
  updateFields.push("updated_at = CURRENT_TIMESTAMP");

  const updateQuery = `
    UPDATE users 
    SET ${updateFields.join(", ")} 
    WHERE id = ?
  `;
  updateValues.push(userId);

  try {
    const result = await db
      .prepare(updateQuery)
      .bind(...updateValues)
      .run();

    if (!result.success) {
      console.error("ユーザー情報の更新に失敗しました:", result);
      return null;
    }

    return await findById(db, userId);
  } catch (error) {
    console.error("ユーザー情報の更新に失敗しました:", error);
    return null;
  }
};

export const remove = async (
  db: D1Database,
  userId: number
): Promise<boolean> => {
  const result = await db
    .prepare("DELETE FROM users WHERE id = ?")
    .bind(userId)
    .run();
  return result.success;
};
