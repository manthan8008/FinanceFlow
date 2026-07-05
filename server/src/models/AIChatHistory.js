import mongoose from "mongoose";

const aiChatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const AIChatHistory = mongoose.model("AIChatHistory", aiChatHistorySchema);
