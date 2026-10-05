const { Post } = require("../models");

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
  const post = await Post.create({ ...req.body, UserId: req.user.id });
  res.status(201).json(post);
}

async function updatePost(req, res) {
  const id = Number(req.params.id);
  const existing = await Post.findByPk(id);

  if (!existing) {
    return res.status(404).json({ error: `Публикация с id=${id} не найдена` });
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
