// Honoアプリケーションの設定

import { Hono, Context, Next } from "hono";
import { cors } from "hono/cors";
import { jwt, verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { Env, JWTPayload } from "./types";
import userRoutes from "./routes/users";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: "http://localhost:3000", // 特定のオリジンからのリクエストのみ許可（フロントエンドのURL）
    credentials: true, // クッキーを許可
  })
);

// カスタムJWT認証ミドルウェアを設定
const jwtAuth = async (
  c: Context<{ Bindings: Env; Variables: JWTPayload }>, // Bindings: 環境変数の型、Variables: コンテキスト変数の型
  next: Next
) => {
  const token = getCookie(c, "jwt");

  if (!token) {
    return c.json({ error: "認証が必要です" }, 401);
  }

  try {
    const payload = (await verify(
      token,
      c.env.JWT_SECRET
    )) as unknown as JWTPayload; // MEMO:  verify関数の戻り値が何であるかをTypeScriptに明示的に伝えるために、as unknownを使う

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ error: "トークンの有効期限が切れています。" }, 401);
    }

    c.set("userId", payload.userId); // リクエストオブジェクトにユーザーIDをセット
    await next(); // 次のミドルウェアを実行
  } catch (error) {
    console.error("JWT認証エラー:", error);
    return c.json({ message: "無効なトークンです" }, 401);
  }
};

// JWT認証ミドルウェアを設定（ユーザー登録とログイン以外のルートに適用）
app.use(
  "/api/*",
  async (c: Context<{ Bindings: Env; Variables: JWTPayload }>, next: Next) => {
    // JWT認証をスキップするパスとメソッドの組み合わせ
    const skipAuthPaths = [
      { path: "/api/users", method: "POST" },
      { path: "/api/auth/login", method: "POST" },
      { path: "/api/auth/refresh", method: "POST" },
    ];

    // 現在のリクエストがスキップ対象かどうかをチェック
    const shouldSkipAuth = skipAuthPaths.some(
      (route) => c.req.path === route.path && c.req.method === route.method
    );

    if (shouldSkipAuth) {
      return next();
    }

    // その他のルートにJWT認証を適用
    return jwtAuth(c, next);
  }
);

// 認証ルート
app.route("/api/auth", authRoutes);

// ユーザー情報ルート
app.route("/api/users", userRoutes);

// エラーハンドリングミドルウェアを設定
app.use("*", errorHandler);

export default app;
