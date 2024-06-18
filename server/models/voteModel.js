import mongoose, { Schema } from "mongoose";

const VoteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    poll: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
    option: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Vote = mongoose.model("Vote", VoteSchema);

export default Vote;
