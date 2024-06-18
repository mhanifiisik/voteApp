import mongoose from "mongoose";

const { Schema } = mongoose;

const PollSchema = new Schema(
  {
    title: { type: String, required: true },
    options: { type: [String], required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    duration: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    results: { type: Schema.Types.Mixed },
    expired: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", PollSchema);

export default Poll;
