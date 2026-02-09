import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  name: { type: String },
  status: { type: String, default: "Pending" },
  date: { type: Date },
  notes: { type: String },
});

const documentSchema = new mongoose.Schema(
  {
    name: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, default: "Applied" },
    rounds: { type: [roundSchema], default: [] },
    notes: { type: String },
    documents: { type: [documentSchema], default: [] },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
