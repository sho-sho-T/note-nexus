// Honoアプリケーションの設定

import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { Env } from "./types";
import userRoutes from "./routes/users";
import { errorHandler } from "./middlewares/errorHandler";

const app = new Hono<{ Bindings: Env }>();

app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", cors());
app.use("/api/*", jwt({ secret: "TODO: 後でシークレット貼る" }));

app.route("./api/users", userRoutes);

app.use("*", errorHandler);

export default app;
