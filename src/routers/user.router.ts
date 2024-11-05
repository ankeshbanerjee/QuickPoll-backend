import { Router } from "express";
import {
  deleteFCMToken,
  getAuthenticatedUser,
  loginUser,
  registerUser,
  saveFCMToken,
  updateUser,
} from "../controllers/user.controller";
import checkAuth from "../middlewares/auth.middleware";
import { validateData } from "../middlewares/validation.middleware";
import {
  createUserSchema,
  fcmTokenSchema,
  loginUserSchema,
} from "../validators/user.validator";

const router = Router();

router.post("/register", validateData(createUserSchema), registerUser);
router.post("/login", validateData(loginUserSchema), loginUser);
router.get("/me", checkAuth, getAuthenticatedUser);
router.patch("/update", checkAuth, updateUser);
router.post(
  "/save-token",
  checkAuth,
  validateData(fcmTokenSchema),
  saveFCMToken
);
router.post(
  "/delete-token",
  checkAuth,
  validateData(fcmTokenSchema),
  deleteFCMToken
);

export default router;
