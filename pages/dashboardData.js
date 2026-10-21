import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardData() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor");
        const json = await res.json();
        if (Array.isArray(json)) setData(json);
      } catch (err) {
        console.error("Error fetch:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // ================= SORTING DATA =================
  // Untuk TABEL (ID besar di atas)
  const tableData = useMemo(() => {
    return [...data].sort((a, b) => b.id - a.id);
  }, [data]);

  // Untuk GRAFIK (urut waktu)
  const chartData = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(a.waktu) - new Date(b.waktu)
    );
  }, [data]);

  return (
    <div className="min-h-screen bg-blue-50 p-6 text-blue-900">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-4 mb-8 relative">
        <button onClick={() => setIsOpen(!isOpen)} className="text-3xl">☰</button>

        {isOpen && (
          <div className="absolute bg-white border rounded shadow-xl w-40 top-12 z-50">
            <ul>
              <li onClick={() => router.push("/monitoring")}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer">
                Dashboard Tiramitech
              </li>
              <li onClick={() => router.push("/datapanen")}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer">
                Daftar Jamur
              </li>
              <li onClick={() => router.push("/tentang")}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer">
                Tentang Kami
              </li>
            </ul>
          </div>
        )}

        <h1 className="text-3xl font-extrabold tracking-wide text-blue-800">
          LOG DATA SENSOR
        </h1>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-rows-2 gap-6" style={{ height: "80vh" }}>

        {/* ================= TABEL ================= */}
        <div className="bg-white border rounded-lg shadow p-4 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">📋 Log Sensor</h2>

          <table className="min-w-full border border-blue-300 text-sm">
            <thead className="bg-blue-200 font-semibold">
              <tr>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Nama Jamur</th>
                <th className="border px-3 py-2">Suhu (°C)</th>
                <th className="border px-3 py-2">Kelembaban (%)</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Waktu</th>
              </tr>
            </thead>

            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="text-center">
                  <td className="border px-3 py-2">{row.id}</td>
                  <td className="border px-3 py-2">{row.nama_jamur}</td>
                  <td className="border px-3 py-2">{row.suhu}</td>
                  <td className="border px-3 py-2">{row.kelembapan}</td>
                  <td className="border px-3 py-2">{row.status_jamur}</td>
                  <td className="border px-3 py-2">
                    {new Date(row.waktu).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= GRAFIK ================= */}
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-2xl font-bold mb-4">📉 Grafik Suhu & Kelembaban</h2>

          <div className="w-full" style={{ height: "28vh" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="waktu"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleTimeString()
                  }
                />

                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />

                <Tooltip />
                <Legend />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="suhu"
                  stroke="#FF8C00"
                  strokeWidth={3}
                  dot={false}
                  name="Suhu"
                />

                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="kelembapan"
                  stroke="#1E90FF"
                  strokeWidth={3}
                  dot={false}
                  name="Kelembaban"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
