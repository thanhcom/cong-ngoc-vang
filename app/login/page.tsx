"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function LoginPage() {
  // Đổi title trang
      useEffect(() => {
      document.title = "🔒 Đăng nhập - Công Ngọc";
    }, []);

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/update");
    } else {
      setError("Sai mật khẩu!");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-black">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-80 border border-red-400/40">
        <h1 className="text-2xl font-bold text-center text-white mb-6 drop-shadow">
          🔒 Đăng nhập hệ thống cập nhật bảng vàng
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Nhập mật khẩu quản trị"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/90 border border-red-400 focus:ring-2 focus:ring-red-500 outline-none text-gray-800 placeholder-gray-500"
          />

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300"
          >
            Đăng nhập
          </button>

          {error && (
            <p className="text-center text-sm text-yellow-200 mt-2 font-medium">
              ⚠ {error}
            </p>
          )}
        </form>

        <div className="mt-6 text-center text-xs text-gray-200/80">
          © 2025 Vàng Bạc Công Ngọc
        </div>
      </div>
    </div>
  );
}
