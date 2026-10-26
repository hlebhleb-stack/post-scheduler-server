require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { sequelize } = require("./models");
const postsRoutes = require("./routes/postsRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== "production";

// Helmet — набор защитных HTTP-заголовков (XSS, clickjacking и др.)
app.use(helmet());

app.use(express.json({ limit: "10kb" }));

// Глобальный rate limiting — не более 100 запросов за 15 минут с одного IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Слишком много запросов. Попробуйте позже." },
  handler: (req, res, next, options) => {
    console.warn(`[SECURITY] Rate limit превышен: IP ${req.ip} → ${req.method} ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  },
});
app.use(globalLimiter);

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Post Scheduler API работает" });
});

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);

  if (isDev) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }

  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

sequelize
  .authenticate()
  .then(() => console.log("Подключение к базе данных установлено"))
  .catch((err) => console.error("Не удалось подключиться к базе данных:", err.message));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
