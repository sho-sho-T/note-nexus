import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.text("hello Hono!"));

export default app;
