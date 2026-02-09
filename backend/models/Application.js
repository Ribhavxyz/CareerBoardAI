import mongoose from "mongoose";

const roundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, default: "Pending" },
    date: { type: Date },
    notes: { type: String },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, default: "Applied" },
    rounds: { type: [roundSchema], default: [] },
    notes: { type: String },
    documents: { type: [documentSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
