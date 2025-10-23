"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Jika token sudah ada, langsung ke dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        router.push("/dashboard"); // redirect ke dashboard
      }
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-6 rounded-2xl w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-black">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-lg ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Tombol ke Register */}
        <p className="text-center text-gray-500">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}
