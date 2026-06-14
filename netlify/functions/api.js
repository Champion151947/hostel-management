const serverless = require("serverless-http");

let handler;

exports.handler = async (event) => {
  if (!handler) {
    try {
      await import("../../Backend/db.js").catch(() => {});
      const mod = await import("../../Backend/index.js");
      const app = mod.default || mod;
      handler = serverless(app);
    } catch (e) {
      console.error("Init error:", e.message, e.stack);
      return { statusCode: 500, body: JSON.stringify({ error: "Server init failed: " + e.message }) };
    }
  }

  let path = event.path || "/";
  path = path.replace("/.netlify/functions/api", "");
  if (!path.startsWith("/api")) path = "/api" + path;
  event.path = path;

  return await handler(event);
};
