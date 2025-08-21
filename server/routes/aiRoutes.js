import express from "express";
import {
  generateImage,
  removeImageBackground,
  removeImageObject,
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

// ✅ Image generation (text-to-image)
aiRouter.post("/generate-image", generateImage);

// ✅ Image background removal (with file upload)
aiRouter.post(
  "/remove-image-background",
  upload.single("image"),
  removeImageBackground
);

// ✅ Image object removal (with file upload)
aiRouter.post(
  "/remove-image-object",
  upload.single("image"),
  removeImageObject
);

export default aiRouter;