// pages/api/mqtt.js
import mqtt from "mqtt";
import db from "../../lib/db.js";

// Koneksi ke broker MQTT
const client = mqtt.connect("mqtt://broker.hivemq.com"); // ganti sesuai broker kamu

client.on("connect", () => {
  console.log("Terhubung ke MQTT broker");
  client.subscribe("sensor/tani", (err) => {
    if (!err) console.log("Subscribed ke topic sensor/tani");
  });
});

client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const { namaJamur, waktu, suhu, kelembapan, statusJamur } = data;

    if (!namaJamur || !waktu || !suhu || !kelembapan || !statusJamur) return console.warn("Data tidak lengkap:", data);

    await db.query("INSERT INTO sensor_data (suhu, kelembapan) VALUES (?, ?)", [suhu, kelembapan]);
    console.log("Data dari MQTT disimpan:", suhu, kelembapan);
  } catch (err) {
    console.error("Gagal simpan data MQTT:", err);
  }
});

export default function handler(req, res) {
  res.status(200).json({ message: "MQTT listener aktif" });
}
