import { useState } from "react";

export default function InputData() {
  const [formData, setFormData] = useState({
    nama_Jamur: "",
    suhu: "",
    kelembaban: "",
    status_jamur: "",
    waktu: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://192.168.200.5:3000/api/sensor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    alert(result.message || "Data berhasil dikirim!");
  };

  return (
    <div style={{ margin: "50px" }}>
      <h2>Input Data Log Sensor</h2>
      <form onSubmit={handleSubmit}>
        <label>Nama Jamur:</label>
        <input
          type="text"
          name="nama_Jamur"
          value={formData.nama_Jamur}
          onChange={handleChange}
          required
        />
        <br />

        <label>Suhu (°C):</label>
        <input
          type="number"
          name="suhu"
          value={formData.suhu}
          onChange={handleChange}
          required
        />
        <br />

        <label>Kelembapan (%):</label>
        <input
          type="number"
          name="kelembaban"
          value={formData.kelembaban}
          onChange={handleChange}
          required
        />
        <br />

        <label>Status_jamur:</label>
        <input
          type="text"
          name="status_jamur"
          value={formData.status_jamur}
          onChange={handleChange}
          required
        />
        <br />

        <label>Waktu:</label>
        <input
          type="datetime-local"
          name="waktu"
          value={formData.waktu}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Kirim Data</button>
      </form>
    </div>
  );
}
 