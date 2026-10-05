const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn(`[SECURITY] Попытка доступа без токена: ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ error: "Токен не предоставлен" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.warn(`[SECURITY] Неверный токен: ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ error: "Недействительный токен" });
  }
}

module.exports = authMiddleware;
