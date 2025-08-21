import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["open", "in_progress", "resolved", "closed"], 
      default: "open" 
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // AI triage fields
    category: { type: String, enum: ["billing","tech","shipping","other"], default: "other" },
    draftReply: { type: String },
    confidence: { type: Number, default: 0 },
    kbSuggestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }]
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);