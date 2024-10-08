// Honoアプリケーションの設定

import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { Env } from "./types";
import userRoutes from "./routes/users";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", cors());

// 認証ルート
app.route("/api/auth", authRoutes);

// JWT認証ミドルウェアを設定（ユーザー登録とログイン以外のルートに適用）
app.use("/api/*", async (c, next) => {
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
  return jwt({ secret: c.env.JWT_SECRET })(c, next);
});

app.route("/api/users", userRoutes);

app.use("*", errorHandler);

export default app;
