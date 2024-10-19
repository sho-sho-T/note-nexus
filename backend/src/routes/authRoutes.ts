import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Env, JWTPayload } from "../types";
import * as userModel from "../models/user";
import { comparePassword } from "../utils/passwordUtils";
import { getCookie, setCookie } from "hono/cookie";

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
      message: "ログインに成功しました",
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

  // Cookieを無効化
  setCookie(c, "jwt", "", {
    httpOnly: true,
    secure: c.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 0, // 有効期限を0に設定してCookieを削除
    path: "/",
  });

  return c.json({ message: "ログアウトに成功しました" });
});

// トークンのリフレッシュ
authRoutes.post("/refresh", async (c) => {
  const token = getCookie(c, "jwt");

  if (!token) {
    return c.json({ error: "トークンが見つかりません" }, 401);
  }

  try {
    const payload = (await verify(
      token,
      c.env.JWT_SECRET
    )) as unknown as JWTPayload; // MEMO:  verify関数の戻り値が何であるかをTypeScriptに明示的に伝えるために、as unknownを使う

    // トークンの有効期限が切れていたらエラーを返す
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("トークンが期限切れです");
    }

    if (!payload.userId) {
      throw new Error("ユーザーIDが見つかりません");
    }

    const newToken = await generateToken(payload.userId, c.env.JWT_SECRET);

    // 新しいトークンをCookieにセット
    setCookie(c, "jwt", newToken, {
      httpOnly: true,
      secure: c.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600,
    });

    return c.json({ message: "トークンのリフレッシュに成功しました" });
  } catch (error) {
    console.log("トークンのリフレッシュエラー:", error);
    return c.json({ error: "トークンのリフレッシュに失敗しました" }, 401);
  }
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

  console.log("ユーザーID", userId);
  const payload = {
    userId: userId,
    exp: currentTimestamp + 3600, // 1時間後に期限切れ
  };

  return sign(payload, secret);
};

export default authRoutes;
