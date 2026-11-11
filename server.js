require("dotenv").config();

const app = require("./app");
const logger = require("./logger");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => logger.info("Database connection established"))
  .catch((err) => logger.error("Database connection failed", { message: err.message }));

app.listen(PORT, () => {
  logger.info("Server started", { port: PORT, env: process.env.NODE_ENV || "development" });
});
