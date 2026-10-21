import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const yakin = window.confirm("Apakah anda yakin ingin log out?");

    if (yakin) {
      // Kalau klik OK → logout
      localStorage.removeItem("isLoggedIn");
      router.replace("/login"); // pakai replace supaya tidak bisa back lagi
    } else {
      // Kalau klik Cancel → kembali ke dashboard
      router.replace("/monitoring"); // ganti sesuai nama halaman dashboard kamu
    }
  }, [router]);

  return null;
}