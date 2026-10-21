import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import mqtt from "mqtt";

export default function Monitoring() {
  const router = useRouter();
  const [dataLog, setDataLog] = useState([]);
  const [dataJamur, setDataJamur] = useState([]);
  const [jamurAktif, setJamurAktif] = useState(null);
  

  // === PROTEKSI HALAMAN ===
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, []);

  // === STATE BARU UNTUK USER MENU ===
  const [showUserMenu, setShowUserMenu] = useState(false);

  // === STATE SENSOR ===
  const [suhu, setSuhu] = useState(null);
  const [kelembapan, setKelembapan] = useState(null);

  const [logData, setLogData] = useState([]);
  
  // ================= DATA TANAM =================
  const [hariKe, setHariKe] = useState(null);
  const [faseJamur, setFaseJamur] = useState("Menunggu data...");

  // === STATE MENU & KONTROL ===
  const [mode, setMode] = useState("MANUAL");

  const [kipasOn, setKipasOn] = useState(false);
  const [pompaOn, setPompaOn] = useState(false);
  const [lampuOn, setLampuOn] = useState(false);

  const [isOpen, setIsOpen] = useState(false);


  const tableData = useMemo(() => {
    return [...dataLog].sort((a, b) => b.id - a.id);
  }, [dataLog]);

  // ========================================
  //          MQTT CLIENT SETUP
  // ========================================
  const [mqttClient, setMqttClient] = useState(null);
  useEffect(() => {
    const client = mqtt.connect("ws://broker.emqx.io:8083/mqtt", {
      clientId: "web_monitoring_" + Math.random().toString(16).slice(2),
      clean: true,
      reconnectPeriod: 1000,
    });

    client.on("connect", () => {
      console.log("MQTT CONNECTED FROM MONITORING");

      client.subscribe("stat/Tiramitech_Tasmota_Salsabila_04/POWER1");
      client.subscribe("stat/Tiramitech_Tasmota_Salsabila_04/POWER2");
      client.subscribe("stat/Tiramitech_Tasmota_Salsabila_04/POWER3");
    });

    client.on("message", (topic, message) => {
      const msg = message.toString();
      console.log("MQTT IN:", topic, msg);

      if (topic.endsWith("POWER1")) {
        setKipasOn(msg === "ON");
      }

      if (topic.endsWith("POWER2")) {
        setPompaOn(msg === "ON");
      }

      if (topic.endsWith("POWER3")) {
        setLampuOn(msg === "ON");
      }
    });

    setMqttClient(client);
    return () => client.end();
  }, []);


  // ========================================
  //          FETCH SENSOR REALTIME
  // ========================================
useEffect(() => {
  const fetchSensor = async () => {
    try {
      const resp = await fetch("/api/sensor");
      const data = await resp.json();

      if (!Array.isArray(data) || data.length === 0) return;
      setDataLog(data);
      
      const latest = data[0];

      setSuhu(latest.suhu);                 // ✅ huruf kecil
      setKelembapan(latest.kelembapan);     // ✅ huruf kecil
      setFaseJamur(latest.fase);            // ✅ huruf kecil

    } catch (err) {
      console.log("Gagal mengambil data sensor", err);
    }
  };

  fetchSensor();
  const interval = setInterval(fetchSensor, 3000);
  return () => clearInterval(interval);
}, []);

  // ========================================
  //          FETCH DATA JAMUR
  // ========================================
  useEffect(() => {
    const fetchJamur = async () => {
      try {
        const res = await fetch("/api/jamur");
        const data = await res.json();
        setDataJamur(data);
      } catch (err) {
        console.log("Gagal ambil data jamur", err);
      }
    };

    fetchJamur();
  }, []);

  // ========================================
  //        LOAD JAMUR AKTIF DARI STORAGE
  // ========================================
  useEffect(() => {
    const saved = localStorage.getItem("jamurAktif");

    if (saved) {
      setJamurAktif(JSON.parse(saved));
    }
  }, []);

  // ========================================
  //            MODE OTOMATIS /
  // ========================================
  const sendMode = (newMode) => {
    console.log("MODE UI:", newMode
    );
    console.log("MODE SEND: Mode", newMode);
  }

  // ========================================
  //         KONTROL ALAT MANUAL
  // ========================================
  const sendControl = (alat, status) => {
    if (!mqttClient) return;

    let relay = 1;
    if (alat === "kipas") relay = 1;
    if (alat === "pompa") relay = 2;
    if (alat === "lampu") relay = 3;

    const topic = `cmnd/Tiramitech_Tasmota_Salsabila_04/POWER${relay}`;
    const payload = status ? "ON" : "OFF";

    mqttClient.publish(topic, payload);
    console.log("MQTT SEND:", topic, payload);
  };

  // ========================================
  //           PANTAU JAMUR
  // ========================================
  const handlePantauJamur = (row) => {
    setJamurAktif(row);
    localStorage.setItem("jamurAktif", JSON.stringify(row));
  };
    
  return (
    <div className="min-h-screen bg-blue-50 p-6 text-blue-900">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 relative">

        {/* MENU KIRI */}
        <div className="flex items-center gap-4"></div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-3xl">☰</button>

        {isOpen && (
          <div className="absolute bg-white border rounded shadow-xl w-40 top-12 z-50">
            <ul>
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

              <li
                onClick={() => router.push("/tentang")}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                Tentang Kami
              </li>
            </ul>
          </div>
        )}

        <h1 className="text-3xl font-extrabold tracking-wide text-blue-800 text-center">
          DASHBOARD TIRAMITECH
        </h1>
      </div>

      {/*USER ICON KANAN ATAS */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="text-2xl bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
        >
          👤
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border">
            <button
              onClick={() => router.push("/logout")}
              className="w-full text-left px-4 py-2 hover:bg-blue-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* GRID UTAMA */}

      <div className="grid grid-cols-3 gap-6">

        {/* INFO SUHU */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h2 className="font-bold text-blue-700 text-lg">Kebutuhan Suhu Jamur</h2>
          <ul className="text-sm mt-3 text-gray-700">
            <li style={{ marginBottom: "10px" }}>• Inokulasi: 22–26°C, kelembapan 70%</li>
            <li style={{ marginBottom: "20px" }}>biasanya media akan tampak putih merata 50 hari.</li>

            <li style={{ marginBottom: "10px" }}>• Inkubasi: 22–28°C, kelembapan 80–90%</li>
            <li style={{ marginBottom: "20px" }}>Umur bibit optimal 50 hari</li>

            <li style={{ marginBottom: "10px" }}>• HST: 18–22°C</li>
            <li style={{ marginBottom: "20px" }}>pemanenan ini dilakukan 5 hari setelah tumbuh calon jamur. Pemanenan sebaiknya dilakukan pada pagi hari untuk mempertahankan kesegarannya dan mempermudah pemasaran.</li>
          </ul>
        </div>

        {/* SENSOR */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-6 rounded-xl shadow-md w-full text-center">
            <p className="font-bold text-blue-700">SUHU RUANG</p>
            <p className="text-2xl font-semibold mt-2">
              {suhu !== null ? `${suhu}°C` : "Loading..."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md w-full text-center">
            <p className="font-bold text-blue-700">KELEMBABAN</p>
            <p className="text-2xl font-semibold mt-2">
              {kelembapan !== null ? `${kelembapan}%` : "Loading..."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md w-full text-center">
            <p className="font-bold text-blue-700">FASE JAMUR</p>
            <p className="text-2xl font-semibold mt-2">
              {faseJamur}
            </p>
          </div>
        </div>
      
      {/* DAFTAR JAMUR */}
      <div className="bg-white p-4 rounded-xl shadow-md h-[350px] overflow-y-auto">

        <h2 className="font-bold text-blue-700 mb-3">
          Daftar Jamur
        </h2>

        <table className="min-w-full border text-sm">
          <thead className="bg-blue-200 sticky top-0">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Nama Jamur</th>
              <th className="border px-3 py-2">Fase</th>
              <th className="border px-3 py-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {dataJamur.map((row) => {
              const isAktif = jamurAktif?.id === row.id;

              return (
                <tr key={row.id} className="text-center">
                  <td className="border px-3 py-2">{row.id}</td>
                  <td className="border px-3 py-2">{row.nama_jamur}</td>
                  <td className="border px-3 py-2">{row.fase_awal}</td>

                  <td className="border px-3 py-2">

                    <button
                      onClick={() => handlePantauJamur(row)}
                      disabled={isAktif}
                      className={`px-3 py-1 rounded text-white
                      ${isAktif
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"}`}
                    >

                      {isAktif
                        ? "👁 Sedang Dipantau"
                        : "▶ Pantau Jamur"}

                    </button>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
      </div>
      
      {/* LOG DATA SENSOR */}
      <div className="mt-10 bg-white p-5 rounded-xl shadow-md max-h-80 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Log Data Sensor</h2>

        <table className="min-w-full border border-blue-300 text-sm">
          <thead className="bg-blue-200">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Nama Jamur</th>
              <th className="border px-3 py-2">Suhu</th>
              <th className="border px-3 py-2">Kelembaban</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Waktu</th>
            </tr>
          </thead>

          <tbody>
            {tableData.slice(0,20).map((row) => (
              <tr key={row.id} className="text-center">
                <td className="border px-3 py-2">{row.id}</td>
                <td className="border px-3 py-2">{jamurAktif ? jamurAktif.nama_jamur : "-"}</td>
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
      
      {/* KONTROL ALAT */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* KIPAS */}
      <div className="flex flex-col items-center gap-3">
        <p className="font-semibold text-blue-700">
          KONTROL KIPAS 
        </p>
      </div>

      {/* POMPA */}
      <div className="flex flex-col items-center gap-3">
        <p className="font-semibold text-blue-700">
          KONTROL POMPA AIR
        </p>
      </div>

      {/* LAMPU */}
      <div className="flex flex-col items-center gap-3">
        <p className="font-semibold text-blue-700">
          KONTROL LAMPU HANGAT
        </p>
      </div>

    </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        {[
          ["POWER 1", kipasOn, setKipasOn, "kipas"],
          ["POWER 2", pompaOn, setPompaOn, "pompa"],
          ["POWER 3", lampuOn, setLampuOn, "lampu"],
        ].map(([label, state, setState, alat]) => (
          <button
            key={alat}
            disabled={mode !== "MANUAL"}
            onClick={() => {
              if (mode === "MANUAL") {
                const newState = !state;
                setState(!state);
                sendControl(alat, newState);
              }
            }}
            className={`py-3 rounded-lg text-white font-semibold shadow 
              ${mode !== "MANUAL" ? "bg-gray-400 cursor-not-allowed" :state ? "bg-blue-400"
                : "bg-blue-700 hover:bg-blue-800"}`}
          >
            {label} {state ? "ON" : "OFF"}
          </button>
        ))}
      </div>

      {/* MODE */}
      <div className="mt-10 flex justify-center gap-6">
        <button
          onClick={() => {
            setMode("MANUAL");
            sendMode("MANUAL");
          }}
          className={`px-6 py-2 rounded-lg font-semibold
            ${mode === "MANUAL" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
        >
          MANUAL
        </button>

        <button
          onClick={() => {
            setMode("OTOMATIS");
            sendMode("OTOMATIS");
          }}
          className={`px-6 py-2 rounded-lg font-semibold
            ${mode === "OTOMATIS" ? "bg-blue-700 text-white" : "bg-gray-200"}`}
        >
          OTOMATIS
        </button>
      </div>
    </div>
  );
}
