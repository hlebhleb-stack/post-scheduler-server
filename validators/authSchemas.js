const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Некорректный формат email",
    "any.required": "Email обязателен",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Пароль должен содержать минимум 6 символов",
    "any.required": "Пароль обязателен",
  }),
  role: Joi.string().valid("user", "admin").default("user"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Некорректный формат email",
    "any.required": "Email обязателен",
  }),
  password: Joi.string().required().messages({
    "any.required": "Пароль обязателен",
  }),
});

module.exports = { registerSchema, loginSchema };
