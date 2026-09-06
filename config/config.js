require("dotenv").config();

const shared = {
  use_env_variable: "DATABASE_URL",
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

module.exports = {
  development: shared,
  test: shared,
  production: shared,
};
