import { useState } from "react";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nama || !password || !confirm) {
      alert("Semua field harus diisi!");
      return;
    }

    if (password !== confirm) {
      alert("Password dan konfirmasi tidak sama!");
      return;
    }

    // contoh sederhana: simpan akun ke localStorage
    localStorage.setItem("user", JSON.stringify({ nama, password }));
    alert("Akun berhasil dibuat! Silakan login.");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">SIGN IN</h1>

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

          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-black placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-full hover:bg-blue-800"
          >
            SIGN IN
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Sudah punya akun?{" "}
          <span
            className="text-blue-700 font-bold cursor-pointer"
            onClick={() => router.push("/login")}
          >
            LOG IN
          </span>
        </p>
      </div>
    </div>
  );
}
