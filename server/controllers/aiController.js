import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import Creation from "../models/Creation.js"; // MongoDB model

export const generateImage = async (req, res) => {
  try {
    const { prompt, publish } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    // Call Clipdrop API
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

    // Upload to Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    // Save in MongoDB
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

// ✅ 2. Remove Background
export const removeImageBackground = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

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

// ✅ 3. Remove Object
export const removeImageObject = async (req, res) => {
  try {
    const { object } = req.body;
    const image = req.file;

    if (!object) {
      return res.status(400).json({ success: false, message: "Missing object to remove" });
    }
    if (!image) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

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
