import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import Jamur from "../public/fungus.png";
import { useState } from "react";

export default function About() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 p-6">
      
      {/* ===== HEADER ===== */}
      <div className="relative mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-3xl cursor-pointer"
          >
            ☰
          </button>

          <h1 className="text-3xl font-extrabold text-blue-800 tracking-wide">
            TENTANG KAMI
          </h1>
        </div>

        {/* ===== DROPDOWN MENU ===== */}
        {isOpen && (
          <div className="absolute top-12 left-0 z-50 w-44 bg-white border rounded-xl shadow-xl">
            <ul>
              <li
                onClick={() => router.push("/monitoring")}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                Dashboard Tiramitech
              </li>
              <li
                onClick={() => router.push("/dashboardData")}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                Log Data Sensor
              </li>
              <li
                onClick={() => router.push("/datapanen")}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                Daftar Jamur
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ===== KONTEN UTAMA ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-10 mx-auto w-full max-w-5xl"
      >
        {/* Gambar */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Image
            src={Jamur}
            alt="Jamur IoT"
            className="w-56 h-56 object-contain"
          />
        </motion.div>

        {/* Teks */}
        <div className="max-w-xl text-lg font-medium">
          <p className="leading-relaxed mb-6">
            <span className="font-bold text-blue-900">Tiramitech</span> adalah
            sistem IoT untuk pengelolaan kumbung jamur tiram yang memungkinkan
            monitoring suhu dan kelembapan secara otomatis dan jarak jauh.
          </p>

          <h2 className="text-xl font-extrabold mb-4 text-blue-900">
            Tujuan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              className="p-4 bg-blue-100 rounded-2xl font-semibold cursor-pointer transition"
            >
              Memperkenalkan teknologi IoT dalam pengelolaan kumbung jamur.
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              className="p-4 bg-blue-100 rounded-2xl font-semibold cursor-pointer transition"
            >
              Mempermudah penyiraman otomatis bagi petani.
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              className="p-4 bg-blue-100 rounded-2xl font-semibold cursor-pointer transition"
            >
              Monitoring suhu & kelembapan secara real-time dari jarak jauh.
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
              }}
              className="p-4 bg-blue-100 rounded-2xl font-semibold cursor-pointer transition"
            >
              Membantu petani bekerja lebih efisien dan berkelanjutan.
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
