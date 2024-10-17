import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Env, JWTPayload } from "../types";
import * as userModel from "../models/user";
import { comparePassword } from "../utils/passwordUtils";
import { setCookie } from "hono/cookie";

const authRoutes = new Hono<{ Bindings: Env }>();

// ログインのスキーマ
const loginSchema = z.object({
  username: z.string().min(1, "ユーザー名は必須です"),
  password: z.string().min(1, "パスワードは必須です"),
});

// リフレッシュトークンのスキーマ
const refreshTokenSchema = z.object({
  token: z.string().min(1, "トークンは必須です"),
});

// ログイン
authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const { username, password } = c.req.valid("json");

  try {
    // ユーザー認証
    const user = await authenticateUser(username, password, c.env.DB);

    // JWTトークン生成
    const token = await generateToken(user.id, c.env.JWT_SECRET);

    // トークンをCookieにセット
    setCookie(c, "jwt", token, {
      httpOnly: true, // JavaScriptからCookieにアクセスできないようにする
      secure: c.env.NODE_ENV === "production", // HTTPS接続時のみCookieを送信する
      sameSite: "Lax", // クロスサイトリクエストを制限する
      maxAge: 3600, // 1時間後に期限切れ
      path: "/", // クッキーの有効なパス
    });

    return c.json({
      token,
      user: { id: user.id, username: user.username },
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

// トークンのリフレッシュ
authRoutes.post(
  "/refresh",
  zValidator("json", refreshTokenSchema),
  async (c) => {
    const { token } = c.req.valid("json");

    try {
      const payload = (await verify(
        token,
        c.env.JWT_SECRET
      )) as unknown as JWTPayload; // MEMO:  verify関数の戻り値が何であるかをTypeScriptに明示的に伝えるために、as unknownを使う

      if (!payload.userId) {
        throw new Error("ユーザーIDが見つかりません");
      }

      const newToken = await generateToken(payload.userId, c.env.JWT_SECRET);

      return c.json({ token: newToken });
    } catch (error) {
      console.log("トークンのリフレッシュエラー:", error);
      return c.json({ error: "トークンのリフレッシュに失敗しました" }, 500);
    }
  }
);

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

  console.log("ユーザーID", userId);
  const payload = {
    userId: userId,
    exp: currentTimestamp + 3600, // 1時間後に期限切れ
  };

  return sign(payload, secret);
};

export default authRoutes;
