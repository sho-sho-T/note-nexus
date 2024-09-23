import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Env } from "../types";
import * as userModel from "../models/user";
import { hashPassword } from "../utils/passwordUtils";

const userRoutes = new Hono<{ Bindings: Env }>();

const userSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
});

// MEMO: zValidator({検証対象}, {スキーマ}, {optional}})　検証対象：json,form,query,header,cookieなど
// c.req.valid(); で検証後の値を取得できる
userRoutes.post("/", zValidator("json", userSchema), async (c) => {
  const { username, password } = c.req.valid("json");
  const hashedPassword = await hashPassword(password);

  try {
    const user = await userModel.create(c.env.DB, username, hashedPassword);
    return c.json({ message: "ユーザーの登録に成功しました。", user }, 201);
  } catch (error) {
    if (
      // errorが標準のErrorオブジェクトのインスタンスであるかをチェック
      error instanceof Error &&
      error.message === "このユーザーはすでに登録されています。"
    ) {
      return c.json({ error: "そのユーザー名はすでに登録されています。" }, 400);
    }
    throw error;
  }
});

userRoutes.get("/:userId", async (c) => {
  const userId = c.req.param("userId");
  const user = await userModel.findById(c.env.DB, parseInt(userId));

  if (user) {
    return c.json(user);
  } else {
    return c.json({ error: "ユーザーが見つかりません" }, 404);
  }
});

userRoutes.put(
  "/:userId",
  zValidator("json", userSchema.partial()),
  async (c) => {
    const userId = c.req.param("userId");
    const { username, password } = c.req.valid("json");
    let hashedPassword;

    if (password) {
      hashedPassword = await hashPassword(password);
    }

    const updatedUser = await userModel.update(
      c.env.DB,
      parseInt(userId),
      username,
      hashedPassword
    );

    if (updatedUser) {
      return c.json({
        message: "ユーザー情報の更新に成功しました",
        user: updatedUser,
      });
    } else {
      return c.json({ error: "ユーザーが見つかりません" }, 404);
    }
  }
);

userRoutes.delete("/:userId", async (c) => {
  const userId = c.req.param("userId");
  const deleted = await userModel.remove(c.env.DB, parseInt(userId));

  if (deleted) {
    return c.json({ message: "ユーザーの削除に成功しました" });
  } else {
    return c.json({ error: "ユーザーが見つかりません" }, 404);
  }
});

export default userRoutes;
