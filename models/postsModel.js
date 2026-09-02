let posts = [
  {
    id: 1,
    content: "Запуск нового продукта уже на следующей неделе!",
    platform: "instagram",
    scheduledAt: "2026-09-10T09:00:00.000Z",
    status: "scheduled",
  },
  {
    id: 2,
    content: "Итоги квартала: делимся результатами команды.",
    platform: "telegram",
    scheduledAt: "2026-09-12T15:30:00.000Z",
    status: "scheduled",
  },
];

let nextId = 3;

function getAll() {
  return posts;
}

function getById(id) {
  return posts.find((post) => post.id === id);
}

function create(data) {
  const post = {
    id: nextId++,
    content: data.content,
    platform: data.platform,
    scheduledAt: data.scheduledAt,
    status: data.status || "scheduled",
  };
  posts.push(post);
  return post;
}

function update(id, data) {
  const post = getById(id);
  if (!post) return null;
  post.content = data.content;
  post.platform = data.platform;
  post.scheduledAt = data.scheduledAt;
  post.status = data.status || "scheduled";
  return post;
}

function remove(id) {
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
