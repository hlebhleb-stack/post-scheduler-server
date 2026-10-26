const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function register(req, res) {
  const { email, password, role } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Пользователь с таким email уже существует" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ email, passwordHash, role: role || "user" });

  res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    console.warn(`[SECURITY] Попытка входа с несуществующим email: ${email}`);
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    console.warn(`[SECURITY] Неверный пароль для ${email}`);
    return res.status(401).json({ error: "Неверный email или пароль" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  res.status(200).json({ token });
}

async function me(req, res) {
  const user = await User.findByPk(req.user.id, {
    attributes: ["id", "email", "role", "createdAt", "updatedAt"],
  });

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  res.status(200).json(user);
}

module.exports = { register, login, me };
