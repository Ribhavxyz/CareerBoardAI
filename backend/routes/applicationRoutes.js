import { Router } from "express";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
  updateRoundStatus,
  addRound,
  deleteRound,
  addAttachment,
  deleteAttachment,
} from "../controllers/applicationController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

router.patch("/:id/status", updateApplicationStatus);
router.patch("/:id/rounds/:roundId", updateRoundStatus);
router.post("/:id/rounds", addRound);
router.delete("/:id/rounds/:roundId", deleteRound);

router.post("/:id/attachments", upload.single("file"), addAttachment);
router.delete("/:id/attachments/:attachmentId", deleteAttachment);

export default router;
