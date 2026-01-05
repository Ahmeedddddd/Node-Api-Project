// filepath: src/routes/categories.routes.js
import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from "../controllers/categories.controller.js";

const router = Router();

// NOTE: define more specific/static routes before params when applicable
router.get("/", listCategories);
router.post("/", createCategory);

router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
