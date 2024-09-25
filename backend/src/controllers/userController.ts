// MEMO: このコントローラーは使用しない。
// routerをから呼ばれた各関数（createUser,getUser）を実行するようにしていたが、
// zValidator関連の型定義がうまくいかないので、routerで直接apiの処理を書く

import { Context } from "hono";
import { Env } from "../types";
import { hashPassword } from "../utils/passwordUtils";
import * as userModel from "../models/user";

export const createUser = async (c: Context<{ Bindings: Env }>) => {
  const { username, password } = c.req.valid("json");
  const hashedPassword = await hashPassword(password);

  try {
    const user = await userModel.create(c.env.DB, username, hashedPassword);
    return c.json({ message: "ユーザーの登録に成功しました。", user }, 201);
  } catch (error) {
    if (error.message === "このユーザーはすでに登録されています。") {
      return c.json({ error: "そのユーザー名はすでに登録されています。" }, 400);
    }
    throw error;
  }
};

export const getUser = async (c: Context<{ Bindings: Env }>) => {
  const userId = c.req.param("userId");
  const user = await userModel.findById(c.env.DB, parseInt(userId));

  if (user) {
    return c.json(user);
  } else {
    return c.json({ error: "ユーザーが見つかりません" }, 404);
  }
};

export const updateUser = async (c: Context<{ Bindings: Env }>) => {
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
      user: updateUser,
    });
  } else {
    return c.json({ error: "ユーザーが見つかりません" }, 404);
  }
};

export const deleteUser = async (c: Context<{ Bindings: Env }>) => {
  const userId = c.req.param("userId");
  const deleted = await userModel.remove(c.env.DB, parseInt(userId));

  if (deleted) {
    return c.json({ message: "ユーザーの削除に成功しました" });
  } else {
    return c.json({ error: "ユーザーが見つかりません" }, 404);
  }
};
