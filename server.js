require("dotenv").config();

const express = require("express");
const { sequelize } = require("./models");
const postsRoutes = require("./routes/postsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Post Scheduler API работает" });
});

app.use("/posts", postsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Маршрут ${req.method} ${req.originalUrl} не найден` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

sequelize
  .authenticate()
  .then(() => console.log("Подключение к базе данных установлено"))
  .catch((err) => console.error("Не удалось подключиться к базе данных:", err.message));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
