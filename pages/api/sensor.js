import { getDB } from "../../lib/db";

export default async function handler(req, res) {
  const db = await getDB();

  // ==============================
  //  GET DATA SENSOR (UNTUK DASHBOARD)
  // ==============================
  if (req.method === "GET") {
    try {
      const [rows] = await db.query(`
        SELECT
          id,
          Nama_Jamur AS nama_jamur,
          Suhu AS suhu,
          Kelembaban AS kelembapan,
          Status_jamur AS status_jamur,
          DATE_FORMAT(Waktu, '%Y-%m-%dT%H:%i:%s') AS waktu,
          Fase AS fase,
          Hari_ke AS hari_ke
        FROM log_sensor
        ORDER BY id DESC
        LIMIT 50
      `);

      return res.status(200).json(rows);
    } catch (err) {
      console.error("❌ Gagal ambil data sensor:", err);
      return res.status(500).json({ message: "Gagal mengambil data sensor" });
    }
  }

  // ==============================
  //  POST DATA SENSOR (INSERT OTOMATIS)
  // ==============================
  if (req.method === "POST") {
    try {
      const { nama_jamur, suhu, kelembaban } = req.body;

      // ✅ VALIDASI AMAN
      if (
        !nama_jamur ||
        suhu === undefined ||
        kelembaban === undefined
      ) {
        return res.status(400).json({ message: "Data tidak lengkap" });
      }

      // ==============================
      // 1. Ambil data awal jamur
      // ==============================
      const [jamurRows] = await db.query(
        "SELECT * FROM jamur WHERE nama_jamur = ? ORDER BY id DESC LIMIT 1",
        [nama_jamur]
      );

      if (jamurRows.length === 0) {
        return res
          .status(404)
          .json({ message: "Data awal jamur tidak ditemukan" });
      }

      const jamur = jamurRows[0];

      // ==============================
      // 2. Hitung hari_ke
      // ==============================
      const waktuMulai = new Date(jamur.waktu_mulai);
      const sekarang = new Date();
      const selisihHari = Math.floor(
        (sekarang - waktuMulai) / (1000 * 60 * 60 * 24)
      );

      const hari_ke = jamur.hari_awal + selisihHari;

      // ==============================
      // 3. Tentukan fase tanam
      // ==============================
      let fase = "Inokulasi";

      if (hari_ke > 0 && hari_ke <= 50) {
        fase = "Inkubasi";
      } else if (hari_ke > 50) {
        fase = "HST";
      }

      // ==============================
      // 4. Status jamur (sementara)
      // ==============================
      const status_jamur = fase;

      // ==============================
      // 5. INSERT ke log_sensor
      // ==============================
      await db.query(
        `
        INSERT INTO log_sensor
        (Nama_Jamur, Suhu, Kelembaban, Status_jamur, Waktu, Fase, Hari_ke)
        VALUES (?, ?, ?, ?, NOW(), ?, ?)
        `,
        [nama_jamur, suhu, kelembaban, status_jamur, fase, hari_ke]
      );

      return res.status(201).json({
        message: "Data sensor berhasil disimpan",
        nama_jamur,
        suhu,
        kelembaban,
        fase,
        hari_ke,
        status_jamur,
      });
    } catch (err) {
      console.error("❌ Error POST sensor:", err);
      return res.status(500).json({ message: "Gagal menyimpan data sensor" });
    }
  }

  // ==============================
  //  METHOD TIDAK DIIZINKAN
  // ==============================
  return res.status(405).json({ message: "Method tidak diizinkan" });
}



