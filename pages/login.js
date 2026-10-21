import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // LOGIN SEDERHANA
    if (nama === "admin" && password === "12345") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/monitoring");
    } else {
      alert("Nama atau password salah!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
          LOG IN
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Masukkan Nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-black placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Masukkan Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-black placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800"
          >
            LOG IN
          </button>
        </form>

        {/* 🔙 Tombol kembali */}
        <button
          onClick={() => router.push("/")}
          className="w-full mt-3 bg-gray-300 text-gray-800 py-2 rounded-full hover:bg-gray-400"
        >
          Kembali ke Halaman Awal
        </button>

        <p className="text-center mt-4 text-sm text-gray-600">
          Belum memiliki akun?{" "}
          <span
            className="text-blue-700 font-bold cursor-pointer"
            onClick={() => router.push("/signin")}
          >
            SIGN-IN
          </span>
        </p>
      </div>
    </div>
  );
}
