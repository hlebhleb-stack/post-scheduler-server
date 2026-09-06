const { Post } = require("../models");

const ALLOWED_PLATFORMS = ["instagram", "telegram", "vk", "twitter", "facebook"];

function validatePostData(data, { partial = false } = {}) {
  const errors = [];

  if (!partial || data.content !== undefined) {
    if (!data.content || typeof data.content !== "string" || !data.content.trim()) {
      errors.push("Поле 'content' обязательно и должно быть непустой строкой");
    }
  }

  if (!partial || data.platform !== undefined) {
    if (!data.platform || !ALLOWED_PLATFORMS.includes(data.platform)) {
      errors.push(`Поле 'platform' обязательно и должно быть одним из: ${ALLOWED_PLATFORMS.join(", ")}`);
    }
  }

  if (!partial || data.scheduledAt !== undefined) {
    if (!data.scheduledAt || isNaN(Date.parse(data.scheduledAt))) {
      errors.push("Поле 'scheduledAt' обязательно и должно быть корректной датой в формате ISO 8601");
    }
  }

  return errors;
}

async function getAllPosts(req, res) {
  const where = {};
  const { platform, status } = req.query;
  if (platform) where.platform = platform;
  if (status) where.status = status;

  const result = await Post.findAll({ where });
  res.status(200).json(result);
}

async function getPostById(req, res) {
  const id = Number(req.params.id);
  const post = await Post.findByPk(id);

  if (!post) {
    return res.status(404).json({ error: `Публикация с id=${id} не найдена` });
  }

  res.status(200).json(post);
}

async function createPost(req, res) {
  const errors = validatePostData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Некорректные данные запроса", details: errors });
  }

  const post = await Post.create(req.body);
  res.status(201).json(post);
}

async function updatePost(req, res) {
  const id = Number(req.params.id);
  const existing = await Post.findByPk(id);

  if (!existing) {
    return res.status(404).json({ error: `Публикация с id=${id} не найдена` });
  }

  const errors = validatePostData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Некорректные данные запроса", details: errors });
  }

  await existing.update(req.body);
  res.status(200).json(existing);
}

async function deletePost(req, res) {
  const id = Number(req.params.id);
  const existing = await Post.findByPk(id);

  if (!existing) {
    return res.status(404).json({ error: `Публикация с id=${id} не найдена` });
  }

  await existing.destroy();
  res.status(204).send();
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
