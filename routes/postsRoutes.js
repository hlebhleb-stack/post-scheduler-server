const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleGuard = require("../middleware/roleGuard");
const validate = require("../middleware/validate");
const { createPostSchema, updatePostSchema } = require("../validators/postSchemas");

// GET /posts — публичный
router.get("/", postsController.getAllPosts);
router.get("/:id", postsController.getPostById);

// POST /posts — только аутентифицированные
router.post("/", authMiddleware, validate(createPostSchema), postsController.createPost);

// PUT /posts/:id — moderator и выше
router.put("/:id", authMiddleware, roleGuard("moderator"), validate(updatePostSchema), postsController.updatePost);

// DELETE /posts/:id — только admin
router.delete("/:id", authMiddleware, roleGuard("admin"), postsController.deletePost);

module.exports = router;
