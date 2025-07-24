import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
    content: { type: String, required: true },
    mood: {
      type: String,
      enum: [
        "Happy",
        "Sad",
        "Nostalgic",
        "Fun Fact",
        "Chill",
        "Romantic",
        "Energetic",
        "Lonely",
        "None",
      ],
      default: "None",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
