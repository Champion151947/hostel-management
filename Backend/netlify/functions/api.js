import { Readable } from "stream";

let app;

async function getApp() {
  if (app) return app;
  const express = (await import("express")).default;
  const cors = (await import("cors")).default;
  await import("../../db.js");
  const authRoutes = (await import("../../routes/auth.js")).default;
  const studentRoutes = (await import("../../routes/student.js")).default;
  const complaintRoutes = (await import("../../routes/complaint.js")).default;
  const roomRoutes = (await import("../../routes/room.js")).default;
  const leaveRoutes = (await import("../../routes/leave.js")).default;
  const feeRoutes = (await import("../../routes/fee.js")).default;

  app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use("/api/students", studentRoutes);
  app.use("/api/complaints", complaintRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/leaves", leaveRoutes);
  app.use("/api/fees", feeRoutes);
  app.get("/api", (req, res) => res.json({ message: "Hostel Management API is running..." }));
  return app;
}

export const handler = async (event) => {
  try {
    const instance = await getApp();
    const { httpMethod, headers, queryStringParameters, body, isBase64Encoded } = event;
    const path = event.path.replace("/.netlify/functions/api", "") || "/";
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
      const respHeaders = {};
      let sent = false;
      instance(req, {
        status(s) { status = s; return this; },
        setHeader(k, v) { respHeaders[k] = v; },
        getHeader(k) { return respHeaders[k]; },
        removeHeader(k) { delete respHeaders[k]; },
        writeHead(s, h) { status = typeof s === "object" ? 200 : s; if (h) Object.assign(respHeaders, h); },
        write() {},
        end(d) { if (sent) return; sent = true; resolve({ statusCode: status, headers: { "content-type": "application/json; charset=utf-8", ...respHeaders }, body: d || "" }); },
        json(d) { this.setHeader("content-type", "application/json; charset=utf-8"); this.end(JSON.stringify(d)); },
        send(d) { if (typeof d === "object") return this.json(d); this.end(String(d)); },
        type(ct) { respHeaders["content-type"] = ct; },
        redirect(s, u) { status = u ? s : 302; respHeaders.Location = u || s; this.end(); },
        locals: {},
      });
    });
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message, stack: err.stack }) };
  }
};
