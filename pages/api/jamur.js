import { getDB } from "../../lib/db";

export default async function handler(req, res) {
  const db = await getDB();

  // ============================
  // CREATE (POST)
  // ============================
  if (req.method === "POST") {
    try {
      const { namaJamur, faseAwal, hariAwal } = req.body;

      if (!namaJamur || !faseAwal || !hariAwal) {
        return res.status(400).json({ message: "Data tidak lengkap" });
      }

      await db.query(
        "INSERT INTO jamur (nama_jamur, fase_awal, hari_awal) VALUES (?, ?, ?)",
        [namaJamur, faseAwal, hariAwal]
      );

      return res.status(201).json({ message: "Data awal jamur disimpan" });
    } catch (err) {
      console.error("❌ POST Error:", err);
      return res.status(500).json({ message: "Gagal menyimpan data" });
    }
  }

  // ============================
  // READ (GET)
  // ============================
  if (req.method === "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM jamur ORDER BY id DESC");
      return res.status(200).json(rows);
    } catch (err) {
      console.error("❌ GET Error:", err);
      return res.status(500).json({ message: "Gagal mengambil data" });
    }
  }

  // ============================
  // UPDATE (PUT)
  // ============================
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { nama_jamur, fase_awal, hari_awal } = req.body;

      if (!id) return res.status(400).json({ message: "ID wajib dikirim" });

      await db.query(
        "UPDATE jamur SET nama_jamur=?, fase_awal=?, hari_awal=? WHERE id=?",
        [nama_jamur, fase_awal, hari_awal, id]
      );

      return res.status(200).json({ message: "Data berhasil diupdate" });
    } catch (err) {
      console.error("❌ PUT Error:", err);
      return res.status(500).json({ message: "Gagal mengupdate data" });
    }
  }

  // ============================
  // DELETE (DELETE)
  // ============================
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) return res.status(400).json({ message: "ID wajib dikirim" });

      await db.query("DELETE FROM jamur WHERE id=?", [id]);

      return res.status(200).json({ message: "Data berhasil dihapus" });
    } catch (err) {
      console.error("❌ DELETE Error:", err);
      return res.status(500).json({ message: "Gagal menghapus data" });
    }
  }

  return res.status(405).json({ message: "Method tidak diizinkan" });
}
