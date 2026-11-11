const jwt = require("jsonwebtoken");
const logger = require("../logger");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Access attempt without token", { method: req.method, url: req.originalUrl });
    return res.status(401).json({ error: "Токен не предоставлен" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (_err) {
    logger.warn("Invalid token", { method: req.method, url: req.originalUrl });
    return res.status(401).json({ error: "Недействительный токен" });
  }
}

module.exports = authMiddleware;
