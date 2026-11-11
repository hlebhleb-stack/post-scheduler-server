require("dotenv").config();

const Sentry = require("@sentry/node");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const logger = require("./logger");
const { requestCounter } = require("./middleware/requestCounter");
const postsRoutes = require("./routes/postsRoutes");
const authRoutes = require("./routes/authRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
});

const app = express();
const isDev = process.env.NODE_ENV !== "production";

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много запросов. Попробуйте позже." },
  handler: (req, res, next, options) => {
    logger.warn("Rate limit exceeded", { ip: req.ip, method: req.method, url: req.originalUrl });
    res.status(options.statusCode).json(options.message);
  },
});
app.use(globalLimiter);
app.use(requestCounter);

app.use((req, res, next) => {
  logger.info("Incoming request", { method: req.method, url: req.originalUrl });
  next();
});

app.use("/", monitoringRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Post Scheduler API работает" });
});

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);

app.get("/test-error", (req, res, next) => {
  next(new Error("Test Sentry error — ИПР2 демонстрация"));
});

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

Sentry.setupExpressErrorHandler(app);

app.use((err, req, res, _next) => {
  logger.error("Unhandled error", { message: err.message, stack: err.stack });

  if (isDev) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }

  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

module.exports = app;
