import { Schema, models, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: String,
    content: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default models.Post || model("Post", PostSchema);
