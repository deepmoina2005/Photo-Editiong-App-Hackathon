import mongoose from "mongoose";

const CreationSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    content: { type: String, required: true }, // URL of image
    type: { type: String, enum: ["image"], default: "image" },
    publish: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Creation", CreationSchema);
