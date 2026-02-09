import Application from "../models/Application.js";

const defaultRounds = [
  { name: "Screening", status: "Pending" },
  { name: "OA", status: "Pending" },
  { name: "Technical", status: "Pending" },
  { name: "HR", status: "Pending" },
  { name: "Offer", status: "Pending" },
];

const STATUS_OPTIONS = ["Applied", "In Process", "Offered", "Rejected"];
const ROUND_STATUS_OPTIONS = ["Pending", "Passed", "Failed"];

export const createApplication = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user?.userId,
      rounds:
        Array.isArray(req.body?.rounds) && req.body.rounds.length
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
    const applications = await Application.find({ userId: req.user?.userId }).sort({
      createdAt: -1,
    });
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
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user?.userId,
    });

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
    const existing = await Application.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (existing.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
    const existing = await Application.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (existing.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await existing.deleteOne();

    return res.json({ message: "Application deleted" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete application",
      error: err.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!status || !STATUS_OPTIONS.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    application.status = status;
    await application.save();

    return res.json(application);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update status",
      error: err.message,
    });
  }
};

export const updateRoundStatus = async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!status || !ROUND_STATUS_OPTIONS.includes(status)) {
      return res.status(400).json({ message: "Invalid round status" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const round = application.rounds.id(req.params.roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    round.status = status;
    await application.save();

    return res.json(application);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update round",
      error: err.message,
    });
  }
};

export const addRound = async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Round name is required" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    application.rounds.push({ name: name.trim(), status: "Pending" });
    await application.save();

    return res.status(201).json(application);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to add round",
      error: err.message,
    });
  }
};

export const deleteRound = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const round = application.rounds.id(req.params.roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    round.deleteOne();
    await application.save();

    return res.json(application);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete round",
      error: err.message,
    });
  }
};
