import { Readable } from "stream";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Hostel Management API is running..." });
});

let initialized = false;
let initError = null;

async function initApp() {
  if (initialized) return;
  try {
    console.log("Loading auth routes...");
    const authModule = await import("../../routes/auth.js");
    console.log("auth module loaded, default:", typeof authModule.default);
    app.use("/api/auth", authModule.default);

    console.log("Loading student routes...");
    app.use("/api/students", (await import("../../routes/student.js")).default);

    console.log("Loading complaint routes...");
    app.use("/api/complaints", (await import("../../routes/complaint.js")).default);

    console.log("Loading room routes...");
    app.use("/api/rooms", (await import("../../routes/room.js")).default);

    console.log("Loading leave routes...");
    app.use("/api/leaves", (await import("../../routes/leave.js")).default);

    console.log("Loading fee routes...");
    app.use("/api/fees", (await import("../../routes/fee.js")).default);

    initialized = true;
    console.log("All routes loaded!");
  } catch (err) {
    initError = err.message;
    console.error("Init error:", err.message, err.stack);
  }
}

export const handler = async (event) => {
  await initApp();

  if (initError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: initError }),
    };
  }

  const { httpMethod, headers, queryStringParameters, body, isBase64Encoded } = event;
  const path = event.path.replace("/.netlify/functions/api", "") || "/";
  const qs = new URLSearchParams(queryStringParameters || {}).toString();
  const url = path + (qs ? "?" + qs : "");

  const req = Object.assign(Readable.from(
    body ? [Buffer.from(body, isBase64Encoded ? "base64" : "utf8")] : []
  ), {
    url,
    method: httpMethod,
    headers: Object.entries(headers || {}).reduce((acc, [k, v]) => {
      acc[k.toLowerCase()] = v;
      return acc;
    }, {}),
    socket: { remoteAddress: "127.0.0.1" },
    connection: {},
  });

  return new Promise((resolve) => {
    let statusCode = 200;
    const responseHeaders = {};
    let bodySent = false;

    const res = {
      statusCode: 200,
      status(code) { statusCode = code; return this; },
      sendStatus(code) { statusCode = code; this.end(String(code)); },
      set(k, v) { responseHeaders[k] = v; return this; },
      setHeader(k, v) { responseHeaders[k] = v; },
      getHeader(k) { return responseHeaders[k]; },
      removeHeader(k) { delete responseHeaders[k]; },
      writeHead(s, h) { statusCode = typeof s === "object" ? 200 : s; if (h) Object.assign(responseHeaders, h); },
      write() {},
      end(d) { if (bodySent) return; bodySent = true; resolve({ statusCode, headers: { "content-type": "application/json; charset=utf-8", ...responseHeaders }, body: d || "" }); },
      json(d) { if (bodySent) return; responseHeaders["content-type"] = "application/json; charset=utf-8"; this.end(JSON.stringify(d)); },
      send(d) { if (bodySent) return; if (typeof d === "object" && !Buffer.isBuffer(d)) return this.json(d); this.end(String(d)); },
      type(ct) { responseHeaders["content-type"] = ct; },
      redirect(s, u) { if (u) { statusCode = s; responseHeaders.Location = u; } else { statusCode = 302; responseHeaders.Location = s; } this.end(); },
      append(k, v) { if (responseHeaders[k]) responseHeaders[k] += ", " + v; else responseHeaders[k] = v; },
      locals: {},
      get headersSent() { return bodySent; },
    };

    app(req, res);
  });
};
