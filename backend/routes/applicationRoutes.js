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
} from "../controllers/applicationController.js";

const router = Router();

router.post("/applications", createApplication);
router.get("/applications", getApplications);
router.get("/applications/:id", getApplicationById);
router.put("/applications/:id", updateApplication);
router.delete("/applications/:id", deleteApplication);

router.patch("/applications/:id/status", updateApplicationStatus);
router.patch("/applications/:id/rounds/:roundId", updateRoundStatus);
router.post("/applications/:id/rounds", addRound);
router.delete("/applications/:id/rounds/:roundId", deleteRound);

export default router;
