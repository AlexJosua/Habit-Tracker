import express from "express";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  checkInHabit,
  getHabitCheckins,
} from "../controllers/habit";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

router.use(verifyToken); // semua route di bawah butuh login

router.get("/", getHabits);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/checkin", checkInHabit);
router.get("/:id/checkin", getHabitCheckins);

export default router;
