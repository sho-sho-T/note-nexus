import * as bcrypt from "bcryptjs";

// パスワードのハッシュ化
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // ソルトのラウンド数を指定
  return bcrypt.hash(password, saltRounds);
};

// パスワードの検証
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
