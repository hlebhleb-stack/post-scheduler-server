const postsModel = require("../models/postsModel");

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

function getAllPosts(req, res) {
  let result = postsModel.getAll();

  const { platform, status } = req.query;
  if (platform) {
    result = result.filter((post) => post.platform === platform);
  }
  if (status) {
    result = result.filter((post) => post.status === status);
  }

  res.status(200).json(result);
}

function getPostById(req, res) {
  const id = Number(req.params.id);
  const post = postsModel.getById(id);

  if (!post) {
    return res.status(404).json({ error: `Публикация с id=${id} не найдена` });
  }

  res.status(200).json(post);
}

function createPost(req, res) {
  const errors = validatePostData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Некорректные данные запроса", details: errors });
  }

  const post = postsModel.create(req.body);
  res.status(201).json(post);
}

function updatePost(req, res) {
  const id = Number(req.params.id);
  const existing = postsModel.getById(id);

  if (!existing) {
    return res.status(404).json({ error: `Публикация с id=${id} не найдена` });
  }

  const errors = validatePostData(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Некорректные данные запроса", details: errors });
  }

  const updated = postsModel.update(id, req.body);
  res.status(200).json(updated);
}

function deletePost(req, res) {
  const id = Number(req.params.id);
  const existing = postsModel.getById(id);

  if (!existing) {
    return res.status(404).json({ error: `Публикация с id=${id} не найдена` });
  }

  postsModel.remove(id);
  res.status(204).send();
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
