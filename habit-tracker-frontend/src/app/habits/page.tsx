"use client";
import { useState } from "react";
import axios from "axios";

export default function CreateHabitPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    await axios.post(
      "http://localhost:5000/api/habits",
      { name, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Habit created!");
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Create Habit</h1>
        <input
          type="text"
          placeholder="Habit Name"
          className="border p-2 w-full mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Save Habit
        </button>
      </form>
    </div>
  );
}
