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

authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const { username, password } = c.req.valid("json");

  try {
    const user = await userModel.findByUsername(c.env.DB, username);

    if (!user) {
      return c.json({ error: "ユーザーが見つかりません" }, 401);
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return c.json({ error: "パスワードが不正です" }, 401);
    }

    // 現在のタイムスタンプを取得（秒単位）
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // JWTトークンの生成
    const token = await sign(
      {
        userId: user.user_id,
        exp: currentTimestamp + 3600, // 1時間後に期限切れ
      },
      c.env.JWT_SECRET
    );

    return c.json({
      token,
      user: { id: user.user_id, username: user.username },
    });
  } catch (error) {
    console.log("ログインエラー:", error);
    return c.json({ error: "ログインに失敗しました" }, 500);
  }
});

export default authRoutes;
