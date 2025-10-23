"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("token");

    // Opsional: tampilkan notifikasi
    toast.success("Berhasil logout!");

    // Redirect ke halaman login
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full mt-4"
    >
      Logout
    </button>
  );
}
