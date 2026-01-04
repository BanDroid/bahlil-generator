import { telefuncHandler } from "./telefunc-handler";
import { apply, serve } from "@photonjs/express";
import express from "express";
import { generateRoute } from "./routes/generate";
import rateLimit from "express-rate-limit";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests
  standardHeaders: true,
  legacyHeaders: false,

  // 👇 NOT IP-based
  keyGenerator: () => "faceswap-global",

  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests",
      message: "Please wait before sending another request",
    });
  },
});
const dailyQuotaLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // 50 total requests
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: () => "faceswap-daily-quota",

  handler: (req, res) => {
    res.status(429).json({
      error: "Quota exceeded",
      message: "Daily request limit reached. Try again tomorrow.",
    });
  },
});

export default startApp() as unknown;

function startApp() {
  const app = express();
  app.use("/api/generate", generateRoute);
  apply(app, [
    // Telefunc route. See https://telefunc.com
    telefuncHandler,
  ]);

  return serve(app, {
    port,
  });
}
