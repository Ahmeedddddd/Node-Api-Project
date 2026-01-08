// filepath: src/routes/users.routes.js
import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", listUsers);
router.post("/", createUser);

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
