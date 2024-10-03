import { Hono } from "hono";
import { sign } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Env } from "../types";
import * as userModel from "../models/user";
import { comparePassword } from "../utils/passwordUtils";

const authRoutes = new Hono<{ Bindings: Env }>();

const loginSchema = z.object({
  username: z.string().min(1, "ユーザー名は必須です"),
  password: z.string().min(1, "パスワードは必須です"),
});

// ログイン
authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const { username, password } = c.req.valid("json");

  try {
    const user = await authenticateUser(username, password, c.env.DB);
    const token = await generateToken(user.user_id, c.env.JWT_SECRET);

    return c.json({
      token,
      user: { id: user.user_id, username: user.username },
    });
  } catch (error) {
    console.log("ログインエラー:", error);
    return c.json({ error: "ログインに失敗しました" }, 500);
  }
});

// ログアウト
authRoutes.post("/logout", async (c) => {
  // クライアント側でトークンを削除するため何もしない
  return c.json({ message: "ログアウトに成功しました" });
});

// ユーザー認証処理
const authenticateUser = async (
  username: string,
  password: string,
  db: any
) => {
  const user = await userModel.findByUsername(db, username);
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("パスワードが不正です");
  }

  return user;
};

// JWTトークン生成
const generateToken = async (userId: number, secret: string) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return sign(
    {
      userId,
      exp: currentTimestamp + 3600, // 1時間後に期限切れ
    },
    secret
  );
};

export default authRoutes;
