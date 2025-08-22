import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import fs from "fs";
import Creation from "../models/Creation.js"; // MongoDB model

const BASE_URL = "https://techhk.aoscdn.com/";
const PICWISH_API_KEY = process.env.ENHANCE_API_KEY;
const MAXIMUM_RETRIES = 20;

// =================== EXISTING FUNCTIONS ===================

export const generateImage = async (req, res) => {
  try {
    const { prompt, publish } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    const creation = new Creation({
      prompt,
      content: secure_url,
      type: "image",
      publish: publish ?? false,
    });
    await creation.save();

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Image generation error:", error.message);
    res.status(500).json({ success: false, message: "Image generation failed." });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const image = req.file;
    if (!image) return res.status(400).json({ success: false, message: "No image uploaded" });

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: "background_removal" }],
    });

    const creation = new Creation({
      prompt: "Remove background from image",
      content: secure_url,
      type: "image",
      publish: false,
    });
    await creation.save();

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("Background removal error:", error);
    res.status(500).json({ success: false, message: "Background removal failed." });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { object } = req.body;
    const image = req.file;
    if (!object) return res.status(400).json({ success: false, message: "Missing object to remove" });
    if (!image) return res.status(400).json({ success: false, message: "No image uploaded" });

    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    const creation = new Creation({
      prompt: `Removed ${object} from image`,
      content: imageUrl,
      type: "image",
      publish: false,
    });
    await creation.save();

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error("Object removal error:", error);
    res.status(500).json({ success: false, message: "Object removal failed." });
  }
};

// =================== NEW COLORIZE FUNCTION ===================

export const colorizeImage = async (req, res) => {
  try {
    const image = req.file;
    if (!image) return res.status(400).json({ success: false, message: "No image uploaded" });

    const formData = new FormData();
    formData.append("sync", "0");
    formData.append("return_type", 1);
    formData.append("image_file", fs.createReadStream(image.path));

    const { data } = await axios.post(`${BASE_URL}api/tasks/visual/colorization`, formData, {
      headers: { ...formData.getHeaders(), "X-API-KEY": PICWISH_API_KEY },
    });

    const taskId = data?.data?.task_id;
    if (!taskId) throw new Error("Failed to create colorization task");

    const result = await pollColorizationResult(taskId);
    if (!result?.image) throw new Error("Colorized image not returned");

    fs.unlinkSync(image.path); // remove temp file
    res.json({ success: true, image: result.image });
  } catch (err) {
    console.error("Colorize error:", err);
    res.status(500).json({ success: false, message: "Colorize failed" });
  }
};

const pollColorizationResult = async (taskId, retries = 0) => {
  const MAX_RETRIES = 30;
  const { data } = await axios.get(`${BASE_URL}api/tasks/visual/colorization/${taskId}`, {
    headers: { "X-API-KEY": COLORIZE_API_KEY },
  });

  if (data?.data?.state !== 1) {
    if (retries >= MAX_RETRIES) throw new Error("Colorization timeout");
    await new Promise((res) => setTimeout(res, 1000));
    return pollColorizationResult(taskId, retries + 1);
  }
  return data.data;
};

// =================== NEW ENHANCE FUNCTION ===================

export const enhanceImage = async (req, res) => {
  try {
    const image = req.file;
    if (!image) return res.status(400).json({ success: false, message: "No image uploaded" });

    const taskId = await uploadEnhanceImage(image.path);
    const enhancedImageData = await pollForEnhancedImage(taskId);

    if (!enhancedImageData?.image) throw new Error("Enhanced image not returned");

    fs.unlinkSync(image.path);

    const creation = new Creation({
      prompt: "Enhanced image",
      content: enhancedImageData.image,
      type: "image",
      publish: false,
    });
    await creation.save();

    res.json({ success: true, content: enhancedImageData.image });
  } catch (error) {
    console.error("Image enhancement error:", error.message || error);
    res.status(500).json({ success: false, message: "Image enhancement failed." });
  }
};

const uploadEnhanceImage = async (filePath) => {
  const formData = new FormData();
  formData.append("image_file", fs.createReadStream(filePath));

  const { data } = await axios.post(`${BASE_URL}api/tasks/visual/scale`, formData, {
    headers: { ...formData.getHeaders(), "X-API-KEY": PICWISH_API_KEY },
  });

  if (!data?.data?.task_id) throw new Error("Failed to upload image! Task ID not found.");
  return data.data.task_id;
};

const pollForEnhancedImage = async (taskId, retries = 0) => {
  const result = await fetchEnhancedImage(taskId);

  if (result.state !== 1) {
    console.log(`Processing...(${retries}/${MAXIMUM_RETRIES})`);
    if (retries >= MAXIMUM_RETRIES) throw new Error("Max retries reached. Please try again later.");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return pollForEnhancedImage(taskId, retries + 1);
  }

  return result;
};

const fetchEnhancedImage = async (taskId) => {
  const { data } = await axios.get(`${BASE_URL}api/tasks/visual/scale/${taskId}`, {
    headers: { "X-API-KEY": PICWISH_API_KEY },
  });

  if (!data?.data) throw new Error("Failed to fetch enhanced image! Image not found.");
  return data.data;
};
