import { Router } from "express";
import { cloudinaryMiddleware } from "../middlewares/cloudinary.middleware";
import { multerUploads } from "../middlewares/multer.middleware";
import { uploadController } from "../controllers/upload.controller";
import checkAuth from "../middlewares/auth.middleware";

const router = Router();

router
  .route("/")
  .post(checkAuth, multerUploads, cloudinaryMiddleware, uploadController);

export default router;
