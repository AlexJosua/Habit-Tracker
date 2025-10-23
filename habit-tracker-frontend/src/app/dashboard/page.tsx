"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { isAuthenticated, getUser } from "@/lib/auth";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Habit {
  id: number;
  name: string;
  description?: string;
  current_streak: number;
  longest_streak: number;
  start_date: string;
  checkins: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const user = getUser();
    if (user?.name) setUserName(user.name);

    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const { data } = await api.get("/habits", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHabits(data);
      } catch (error) {
        console.error("Failed to fetch habits:", error);
        toast.error("Failed to load your habits");
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [router]);

  const handleCheckIn = async (habitId: number) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(`/habits/${habitId}/checkin`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Check-in berhasil!");
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,
                current_streak: res.data.current_streak,
                checkins: [
                  ...habit.checkins,
                  new Date().toISOString().split("T")[0],
                ],
              }
            : habit
        )
      );
    } catch (err: any) {
      const message = err.response?.data?.message;
      if (message === "Already checked in today") {
        toast.success("Kamu sudah check-in hari ini 👍");
      } else {
        toast.error("Gagal melakukan check-in 😕");
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Hello, <span className="text-blue-600">{userName}</span> 👋
            </h1>
            <p className="text-gray-500 mt-1">Track your daily habits below</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/habits/create")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              + Create Habit
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
                toast.success("Logged out successfully!");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Logout
            </button>
          </div>
        </div>
        {habits.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            <p className="text-lg">
              You don’t have any habits yet.{" "}
              <span
                onClick={() => router.push("/habits/create")}
                className="text-blue-600 font-medium cursor-pointer hover:underline"
              >
                Create one now
              </span>
              !
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {habits.map((habit) => {
              const isExpanded = expandedId === habit.id;
              const chartData = habit.checkins.map((date, idx) => ({
                date,
                streak: idx + 1,
              }));

              return (
                <div
                  key={habit.id}
                  className="p-5 border border-gray-100 rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : habit.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {habit.name}
                    </h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckIn(habit.id);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                    >
                      Check-In
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Current Streak:{" "}
                    <span className="font-semibold text-blue-600">
                      {habit.current_streak} 🔥
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Longest Streak:{" "}
                    <span className="font-semibold text-indigo-600">
                      {habit.longest_streak}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 space-y-4">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-700 text-sm">
                        <p>
                          <span className="font-semibold">Description:</span>{" "}
                          {habit.description || "-"}
                        </p>
                        <p>
                          <span className="font-semibold">Start Date:</span>{" "}
                          {habit.start_date}
                        </p>
                      </div>

                      <div className="p-2 bg-gray-100 rounded-lg">
                        <h3 className="font-medium mb-2">Completed Days</h3>
                        <Calendar
                          tileClassName={({ date, view }) => {
                            if (view === "month") {
                              const dateStr = date.toISOString().split("T")[0];

                              if (habit.checkins.includes(dateStr)) {
                                return "bg-green-500 text-white rounded-full";
                              }

                              const day = date.getDay();
                              if (day >= 1 && day <= 5) {
                                return "bg-gray-700 text-black rounded-full";
                              }

                              return "bg-gray-400 text-black rounded-full";
                            }
                            return "";
                          }}
                        />
                      </div>

                      <div className="p-2 bg-gray-100 rounded-lg">
                        <h3 className="font-medium mb-2">Progress Chart</h3>
                        {chartData.length > 0 ? (
                          <LineChart width={300} height={180} data={chartData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid
                              stroke="#eee"
                              strokeDasharray="5 5"
                            />
                            <Line
                              type="monotone"
                              dataKey="streak"
                              stroke="#8884d8"
                            />
                          </LineChart>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No check-ins yet
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
