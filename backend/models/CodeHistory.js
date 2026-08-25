import mongoose from "mongoose";

const CodeHistorySchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true
    },

    code: {
      type: String,
      required: true
    },

    stdin: {
      type: String,
      default: ""
    },

    output: {
      type: String,
      default: ""
    },

    analysis: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      default: "completed"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "CodeHistory",
  CodeHistorySchema
);