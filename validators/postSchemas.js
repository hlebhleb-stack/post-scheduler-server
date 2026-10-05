const Joi = require("joi");

const ALLOWED_PLATFORMS = ["instagram", "telegram", "vk", "twitter", "facebook"];

const createPostSchema = Joi.object({
  content: Joi.string().trim().min(1).required().messages({
    "string.empty": "Поле 'content' не может быть пустым",
    "any.required": "Поле 'content' обязательно",
  }),
  platform: Joi.string()
    .valid(...ALLOWED_PLATFORMS)
    .required()
    .messages({
      "any.only": `Поле 'platform' должно быть одним из: ${ALLOWED_PLATFORMS.join(", ")}`,
      "any.required": "Поле 'platform' обязательно",
    }),
  scheduledAt: Joi.string().isoDate().required().messages({
    "string.isoDate": "Поле 'scheduledAt' должно быть датой в формате ISO 8601",
    "any.required": "Поле 'scheduledAt' обязательно",
  }),
  status: Joi.string().valid("draft", "scheduled", "published").default("draft"),
  priority: Joi.number().valid(1, 2, 3).default(2),
});

const updatePostSchema = Joi.object({
  content: Joi.string().trim().min(1).messages({
    "string.empty": "Поле 'content' не может быть пустым",
  }),
  platform: Joi.string()
    .valid(...ALLOWED_PLATFORMS)
    .messages({
      "any.only": `Поле 'platform' должно быть одним из: ${ALLOWED_PLATFORMS.join(", ")}`,
    }),
  scheduledAt: Joi.string().isoDate().messages({
    "string.isoDate": "Поле 'scheduledAt' должно быть датой в формате ISO 8601",
  }),
  status: Joi.string().valid("draft", "scheduled", "published"),
  priority: Joi.number().valid(1, 2, 3),
}).min(1);

module.exports = { createPostSchema, updatePostSchema };
