import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import pool from "../config/db";

// 🔹 GET All Habits
export const getHabits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const habitsRes = await pool.query(
      "SELECT * FROM habits WHERE user_id = $1 ORDER BY id ASC",
      [userId]
    );

    const habitIds = habitsRes.rows.map((h) => h.id);

    let checkins: any[] = [];
    if (habitIds.length > 0) {
      const checkinsRes = await pool.query(
        "SELECT habit_id, checkin_date FROM habits_checkins WHERE habit_id = ANY($1::int[]) ORDER BY checkin_date ASC",
        [habitIds]
      );
      checkins = checkinsRes.rows;
    }

    const habitsWithCheckins = habitsRes.rows.map((habit) => ({
      ...habit,
      checkins: checkins
        .filter((c) => c.habit_id === habit.id)
        .map((c) => c.checkin_date),
    }));

    return res.json(habitsWithCheckins);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch habits" });
  }
};

// 🔹 CREATE a Habit
export const createHabit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id!;
    const { name, description } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const result = await pool.query(
      `INSERT INTO habits (user_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, name, description]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create habit" });
  }
};

// 🔹 UPDATE a Habit
export const updateHabit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id!;
    const habitId = req.params.id;
    const { name, description } = req.body;

    const result = await pool.query(
      `UPDATE habits
       SET name = $1, description = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [name, description, habitId, userId]
    );

    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ message: "Habit not found or unauthorized" });

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update habit" });
  }
};

// 🔹 DELETE a Habit
export const deleteHabit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id!;
    const habitId = req.params.id;

    const result = await pool.query(
      `DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *`,
      [habitId, userId]
    );

    if (result.rows.length === 0)
      return res
        .status(404)
        .json({ message: "Habit not found or unauthorized" });

    return res.json({ message: "Habit deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete habit" });
  }
};

// 🔹 CHECK-IN a Habit
export const checkInHabit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id!;
    const habitId = Number(req.params.id);

    const habitResult = await pool.query(
      "SELECT * FROM habits WHERE id = $1 AND user_id = $2",
      [habitId, userId]
    );
    if (habitResult.rows.length === 0)
      return res.status(404).json({ message: "Habit not found" });

    const habit = habitResult.rows[0];
    const today = new Date().toISOString().split("T")[0];

    const checkinToday = await pool.query(
      "SELECT * FROM habits_checkins WHERE habit_id = $1 AND checkin_date = $2",
      [habitId, today]
    );

    if (checkinToday.rows.length > 0)
      return res.status(200).json({ message: "Already checked in today" });

    const lastCheckinResult = await pool.query(
      "SELECT checkin_date FROM habits_checkins WHERE habit_id = $1 ORDER BY checkin_date DESC LIMIT 1",
      [habitId]
    );

    let currentStreak = habit.current_streak;
    let longestStreak = habit.longest_streak;

    if (lastCheckinResult.rows.length > 0) {
      const lastDate = new Date(lastCheckinResult.rows[0].checkin_date);
      const diffDays = Math.floor(
        (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    await pool.query("INSERT INTO habits_checkins (habit_id) VALUES ($1)", [
      habitId,
    ]);
    await pool.query(
      `UPDATE habits SET current_streak = $1, longest_streak = $2 WHERE id = $3`,
      [currentStreak, longestStreak, habitId]
    );

    return res.json({
      message: "Check-in successful",
      current_streak: currentStreak,
      longest_streak: longestStreak,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Check-in failed" });
  }
};

export const getHabitCheckins = async (req: AuthRequest, res: Response) => {
  try {
    const habitId = Number(req.params.id);
    if (isNaN(habitId))
      return res.status(400).json({ message: "Invalid habit ID" });

    const userId = req.user!.id;

    const checkins = await pool.query(
      `SELECT hc.checkin_date
       FROM habits_checkins hc
       JOIN habits h ON hc.habit_id = h.id
       WHERE hc.habit_id = $1 AND h.user_id = $2
       ORDER BY hc.checkin_date ASC`,
      [habitId, userId]
    );

    if (checkins.rows.length === 0) {
      // Bisa karena habit tidak ada atau belum ada check-in
      // Pastikan habit memang milik user
      const habitExists = await pool.query(
        "SELECT id FROM habits WHERE id = $1 AND user_id = $2",
        [habitId, userId]
      );
      if (habitExists.rows.length === 0)
        return res.status(404).json({ message: "Habit not found" });
    }

    return res.json(checkins.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch check-ins" });
  }
};
