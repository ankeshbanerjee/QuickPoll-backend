import { Router } from "express";
import {
  getAuthenticatedUser,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller";
import checkAuth from "../middlewares/auth.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
  createUserSchema,
  loginUserSchema,
} from "../validators/user.validator";

const router = Router();

router.post("/register", validateData(createUserSchema), registerUser);
router.post("/login", validateData(loginUserSchema), loginUser);
router.get("/me", checkAuth, getAuthenticatedUser);
router.patch("/update", checkAuth, updateUser);

export default router;
