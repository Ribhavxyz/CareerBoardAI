import Application from "../models/Application.js";

const defaultRounds = [
  { name: "Screening", status: "Pending" },
  { name: "OA", status: "Pending" },
  { name: "Technical", status: "Pending" },
  { name: "HR", status: "Pending" },
  { name: "Offer", status: "Pending" },
];

export const createApplication = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      rounds: Array.isArray(req.body?.rounds) && req.body.rounds.length
        ? req.body.rounds
        : defaultRounds,
    };

    const application = await Application.create(payload);
    return res.status(201).json(application);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create application",
      error: err.message,
    });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.json(applications);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch applications",
      error: err.message,
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.json(application);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch application",
      error: err.message,
    });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json(application);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update application",
      error: err.message,
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.json({ message: "Application deleted" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete application",
      error: err.message,
    });
  }
};
