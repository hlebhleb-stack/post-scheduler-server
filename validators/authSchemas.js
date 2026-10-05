const Joi = require("joi");

// №3: пароль минимум 8 символов, цифра, спецсимвол
const passwordSchema = Joi.string()
  .min(8)
  .pattern(/[0-9]/, "цифра")
  .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "спецсимвол")
  .required()
  .messages({
    "string.min": "Пароль должен содержать минимум 8 символов",
    "string.pattern.name": "Пароль должен содержать {#name}",
    "any.required": "Пароль обязателен",
  });

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Некорректный формат email",
    "any.required": "Email обязателен",
  }),
  password: passwordSchema,
  role: Joi.string().valid("user", "moderator", "admin").default("user"),
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
