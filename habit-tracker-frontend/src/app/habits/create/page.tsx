"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CreateHabitPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/habits", { name, description });
      toast.success("Habit created!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Failed to create habit.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-2xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Create Habit
        </h1>

        <input
          type="text"
          placeholder="Habit Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
          required
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-lg"
        >
          Create
        </button>

        {/* Tambahan teks "Back to Dashboard" */}
        <p className="text-center text-sm text-gray-600 mt-4">
          <span
            onClick={() => router.push("/dashboard")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Back to Dashboard
          </span>
        </p>
      </form>
    </div>
  );
}
