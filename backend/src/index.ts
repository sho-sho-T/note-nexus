// エントリーポイント

import app from "./app";

const port = process.env.PORT ? parseInt(process.env.PORT) : 8787;

console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
