import { getDB } from "../../lib/db";

export default async function handler(req, res) {
  const db = await getDB();

  // =============================================
  // CREATE (POST)
  // =============================================
  if (req.method === "POST") {
    try {
      const { nama_jamur, jumlah_panen, tanggal_panen, catatan } = req.body;

      if (!nama_jamur || !jumlah_panen || !tanggal_panen) {
        return res.status(400).json({ message: "Data tidak lengkap" });
      }

      await db.query(
        `INSERT INTO panen (nama_jamur, jumlah_panen, tanggal_panen, catatan)
         VALUES (?, ?, ?, ?)`,
        [nama_jamur, jumlah_panen, tanggal_panen, catatan || null]
      );

      return res.status(201).json({ message: "Data panen berhasil ditambahkan" });
    } catch (err) {
      console.error("❌ POST Panen Error:", err);
      return res.status(500).json({ message: "Gagal menambah data panen" });
    }
  }

  // =============================================
  // READ (GET)
  // =============================================
  if (req.method === "GET") {
    try {
      const [rows] = await db.query("SELECT * FROM panen ORDER BY id DESC");
      return res.status(200).json(rows);
    } catch (err) {
      console.error("❌ GET Panen Error:", err);
      return res.status(500).json({ message: "Gagal mengambil data panen" });
    }
  }

  // =============================================
  // UPDATE (PUT)
  // =============================================
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { nama_jamur, jumlah_panen, tanggal_panen, catatan } = req.body;

      if (!id) return res.status(400).json({ message: "ID wajib dikirim" });

      await db.query(
        `UPDATE panen 
         SET nama_jamur=?, jumlah_panen=?, tanggal_panen=?, catatan=?
         WHERE id=?`,
        [nama_jamur, jumlah_panen, tanggal_panen, catatan, id]
      );

      return res.status(200).json({ message: "Data panen berhasil diupdate" });
    } catch (err) {
      console.error("❌ PUT Panen Error:", err);
      return res.status(500).json({ message: "Gagal mengupdate data panen" });
    }
  }

  // =============================================
  // DELETE
  // =============================================
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) return res.status(400).json({ message: "ID wajib dikirim" });

      await db.query("DELETE FROM panen WHERE id=?", [id]);

      return res.status(200).json({ message: "Data panen berhasil dihapus" });
    } catch (err) {
      console.error("❌ DELETE Panen Error:", err);
      return res.status(500).json({ message: "Gagal menghapus data panen" });
    }
  }

  return res.status(405).json({ message: "Method tidak diizinkan" });
}
