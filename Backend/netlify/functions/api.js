import { Readable } from "stream";

let app;

function resolveHandler(mod) {
  if (typeof mod === "function") return mod;
  if (mod && typeof mod.default === "function") return mod.default;
  if (mod && mod.stack) return mod;
  return null;
}

async function getApp() {
  if (app) return app;

  const express = (await import("express")).default;
  const cors = (await import("cors")).default;
  await import("../../db.js").catch(() => {});

  app = express();
  app.use(cors());
  app.use(express.json());

  const routesToMount = [
    ["/api/auth", "../../routes/auth.js"],
    ["/api/students", "../../routes/student.js"],
    ["/api/complaints", "../../routes/complaint.js"],
    ["/api/rooms", "../../routes/room.js"],
    ["/api/leaves", "../../routes/leave.js"],
    ["/api/fees", "../../routes/fee.js"],
  ];

  const debugInfo = {};
  for (const [mountPath, modulePath] of routesToMount) {
    try {
      const mod = await import(modulePath);
      const handler = resolveHandler(mod.default ?? mod);
      if (handler) {
        let stackInfo = [];
        if (handler.stack) {
          for (const layer of handler.stack) {
            if (layer.route) stackInfo.push(`${Object.keys(layer.route.methods).join(",").toUpperCase()} ${layer.route.path}`);
            else if (layer.name) stackInfo.push(`${layer.name} middleware`);
          }
        }
        debugInfo[mountPath] = { status: "mounted", routes: stackInfo.length ? stackInfo : "empty-router" };
        app.use(mountPath, handler);
      } else {
        const info = { type: typeof mod.default, modKeys: Object.keys(mod) };
        if (mod.default && mod.default.stack) info.routerRoutes = mod.default.stack.map(l => l.route?.path);
        debugInfo[mountPath] = { status: "cannot-resolve-handler", ...info };
      }
    } catch (e) {
      debugInfo[mountPath] = { status: "import-error", error: e.message };
    }
  }
  app.get("/api/debug", (req, res) => res.json(debugInfo));

  app.get("/api", (req, res) => res.json({ message: "Hostel Management API is running..." }));
  return app;
}

export const handler = async (event) => {
  const instance = await getApp();
  const { httpMethod, headers, queryStringParameters, body, isBase64Encoded } = event;
  const path = (event.path || "").replace("/.netlify/functions/api", "/api") || "/api";
  const qs = new URLSearchParams(queryStringParameters || {}).toString();
  const url = path + (qs ? "?" + qs : "");

  const req = Object.assign(Readable.from(
    body ? [Buffer.from(body, isBase64Encoded ? "base64" : "utf8")] : []
  ), {
    url, originalUrl: url, method: httpMethod,
    headers: Object.entries(headers || {}).reduce((a, [k, v]) => (a[k.toLowerCase()] = v, a), {}),
    socket: { remoteAddress: "127.0.0.1" }, connection: {},
  });

  return new Promise((resolve) => {
    let status = 200;
    const rh = {};
    let sent = false;
    instance(req, {
      status(s) { status = s; return this; },
      setHeader(k, v) { rh[k] = v; },
      getHeader(k) { return rh[k]; },
      removeHeader(k) { delete rh[k]; },
      writeHead(s, h) { status = typeof s === "object" ? 200 : s; if (h) Object.assign(rh, h); },
      write() {},
      end(d) { if (sent) return; sent = true; resolve({ statusCode: status, headers: { "content-type": "application/json; charset=utf-8", ...rh }, body: d || "" }); },
      json(d) { this.setHeader("content-type", "application/json; charset=utf-8"); this.end(JSON.stringify(d)); },
      send(d) { if (typeof d === "object") return this.json(d); this.end(String(d)); },
      type(ct) { rh["content-type"] = ct; },
      redirect(s, u) { status = u ? s : 302; rh.Location = u || s; this.end(); },
      locals: {},
    });
  });
};
