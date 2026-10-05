const ROLE_LEVELS = { user: 1, moderator: 2, admin: 3 };

function roleGuard(requiredRole) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || ROLE_LEVELS[userRole] < ROLE_LEVELS[requiredRole]) {
      console.warn(
        `[SECURITY] Попытка доступа с недостаточной ролью: пользователь ${req.user?.id} (${userRole}) → ${req.method} ${req.originalUrl}`
      );
      return res.status(403).json({ error: "Недостаточно прав доступа" });
    }

    next();
  };
}

module.exports = roleGuard;
