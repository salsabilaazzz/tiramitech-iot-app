// pages/api/export.js
import mysql from "mysql2/promise";
import ExcelJS from "exceljs";
const cors = require("cors");
app.use(cors());

export default async function handler(req, res) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // kosongkan "" kalau MySQL tanpa password
      database: "tiramitech",
    });

    const [rows] = await db.execute("SELECT * FROM monitoring ORDER BY tanggal DESC");
    await db.end();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Data Monitoring");

    // Header tabel
    sheet.addRow(["Tanggal", "Suhu (°C)", "Kelembaban (%)", "Status_jamur", "Waktu"]);

    // Isi data
    rows.forEach((row) => {
      sheet.addRow([
        new Date(row.tanggal).toLocaleDateString("id-ID"),
        row.suhu,
        row.kelembaban,
        row.status,
        row.waktu || "-",
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=data_jamur.xlsx");
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal export Excel" });
  }
}
