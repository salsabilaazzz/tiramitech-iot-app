import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PanenDashboard() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [jamurAktif, setJamurAktif] = useState(null);
  const [namaJamur, setNamaJamur] = useState("");
  const [faseAwal, setFaseAwal] = useState("");
  const [hariAwal, setHariAwal] = useState("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const HARI_MIN_PANEN = 150; 

  // =========================
  // AMBIL JAMUR AKTIF
  // =========================
  useEffect(() => {
    const jamur = localStorage.getItem("jamurAktif");
    if (jamur) {
      setJamurAktif(JSON.parse(jamur));
    }
  }, []);

  const handlePantauJamur = (row) => {
    setJamurAktif(row);
    localStorage.setItem("jamurAktif", JSON.stringify(row));
  };

  // =========================
  // HITUNG HARI REALTIME
  // =========================
  const hitungHari = (waktuTanam) => {
    const mulai = new Date(waktuTanam);
    const sekarang = new Date();
    const selisih = sekarang - mulai;
    const hari = Math.floor(selisih / (1000 * 60 * 60 * 24));
    return hari < 0 ? 0 : hari;
  };

  // =========================
  // FETCH DATA
  // =========================
  const getData = async () => {
    const res = await fetch("/api/jamur");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    getData();
  }, []);

  // =========================
  // PANEN
  // =========================
  const handlePanen = async (item) => {
    const tanggal = new Date().toISOString().split("T")[0];

    await fetch(`/api/panen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nama_jamur: item.nama_jamur,
        berat_panen: item.berat || 0,
        tanggal_panen: tanggal,
      }),
    });

    await fetch(`/api/jamur?id=${item.id}`, { method: "DELETE" });

    if (jamurAktif?.id === item.id) {
      setJamurAktif(null);
      localStorage.removeItem("jamurAktif");
    }

    getData();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/jamur?id=${id}`, { method: "DELETE" });

    if (jamurAktif?.id === id) {
      setJamurAktif(null);
      localStorage.removeItem("jamurAktif");
    }

    getData();
  };
  const handleSubmit = async () => {
  if (!namaJamur || !faseAwal || !hariAwal || !waktuMulai) {
    alert("Harap isi semua data!");
    return;
  }

  try {
    const res = await fetch("/api/jamur", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        namaJamur,
        faseAwal,
        hariAwal,
        waktuMulai,
      }),
    });

    if (res.ok) {
      alert("Data jamur berhasil ditambahkan!");

      setNamaJamur("");
      setFaseAwal("");
      setHariAwal("");
      setWaktuMulai("");

      getData(); // refresh tabel
    } else {
      alert("Gagal menambahkan data");
    }
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="min-h-screen bg-blue-50 p-6 text-blue-900">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 relative">
        <button onClick={() => setIsOpen(!isOpen)} className="text-3xl">☰</button>

        {isOpen && (
          <div className="absolute bg-white border rounded shadow w-40 top-12 left-0 z-50">
            <ul>
              <li onClick={() => router.push("/monitoring")} className="px-4 py-2 hover:bg-blue-100 cursor-pointer">Dashboard Tiramitech</li>
              <li onClick={() => router.push("/dashboardData")} className="px-4 py-2 hover:bg-blue-100 cursor-pointer">Log Data Sensor</li>
              <li onClick={() => router.push("/tentang")} className="px-4 py-2 hover:bg-blue-100 cursor-pointer">Tentang Kami</li>
            </ul>
          </div>
        )}

        <h1 className="text-3xl font-extrabold text-blue-800">
          DAFTAR JAMUR 
        </h1>
      </div>

      {/* FORM INPUT */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="font-bold text-blue-700 mb-3">Input Masa Tanam</h2>

        <input
          type="text"
          placeholder="Nama Jamur"
          value={namaJamur}
          onChange={(e) => setNamaJamur(e.target.value)}
          className="w-full border p-2 rounded-lg mb-3 shadow-sm"
        />

        <input
          type="text"
          placeholder="Fase Awal"
          value={faseAwal}
          onChange={(e) => setFaseAwal(e.target.value)}
          className="w-full border p-2 rounded-lg mb-3 shadow-sm"
        />

        <input
          type="number"
          placeholder="Hari Awal"
          value={hariAwal}
          onChange={(e) => setHariAwal(e.target.value)}
          className="w-full border p-2 rounded-lg mb-3 shadow-sm"
        />

        <input
          type="date"
          value={waktuMulai}
          onChange={(e) => setWaktuMulai(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4 shadow-sm"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800"
        >
          Input Data
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-3">📋 Data Jamur</h2>

        <table className="min-w-full border text-sm">
          <thead className="bg-blue-200">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Nama Jamur</th>
              <th className="border px-3 py-2">Fase</th>
              <th className="border px-3 py-2">Hari</th>
              <th className="border px-3 py-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => {
              const hariBerjalan = hitungHari(row.waktu);
              const bolehPanen = hariBerjalan >= HARI_MIN_PANEN;
              const isAktif = jamurAktif?.id === row.id;

              return (
                <tr key={row.id} className="text-center">
                  <td className="border px-3 py-2">{row.id}</td>
                  <td className="border px-3 py-2">{row.nama_jamur}</td>
                  <td className="border px-3 py-2">{row.fase_awal}</td>

                  <td className="border px-3 py-2 font-semibold">
                    {hariBerjalan} hari
                  </td>

                  <td className="border px-3 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handlePanen(row)}
                      disabled={!bolehPanen}
                      className={`px-3 py-1 rounded text-white
                        ${bolehPanen
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-400 cursor-not-allowed"}`}
                    >
                      {bolehPanen ? "✔ Sudah Panen" : "⏳ Belum Panen"}
                    </button>

                    <button
                      onClick={() => handleDelete(row.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑 Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
