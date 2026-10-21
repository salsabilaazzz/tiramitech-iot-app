# Tiramitech - Smart Mushroom Farming IoT Prototype

**Tiramitech** adalah sistem pemantauan dan kontrol suhu berbasis Internet of Things (IoT) untuk budidaya jamur tiram. Sistem ini mengintegrasikan sensor hardware (ESP8266 via Tasmota Firmware dan dht22), API/Middleware Node-RED, database MySQL, dan Dashboard Web berbasis Next.js & javascript.

---

## Tujuan & Cara Kerja Alat

Alat ini bertujuan untuk **menjaga kestabilan pertumbuhan jamur tiram pada suhu rentang 22–28°C** dan **kelembapan stabil pada rentang 70–90%**. Sistem ini membantu petani mengontrol dan memantau kumbung jamur secara otomatis melalui website, serta melakukan perawatan jamur tiram secara jarak jauh.

### Logika Kontrol Otomatis:
- **Suhu Tinggi (> 28°C):** Sistem otomatis menyalakan **kipas** dan **pompa air** untuk menurunkan suhu dan meningkatkan kelembapan.
- **Suhu Rendah (< 22°C):** Sistem otomatis menyalakan **lampu penghangat** untuk menaikkan suhu kembali ke kondisi ideal.

---

## Dokumentasi & Logika Sistem (Dari Laporan Akhir)

> *Catatan: Perangkat keras dan servis Node-RED saat ini dalam status offline (prototipe telah selesai). Berikut adalah dokumentasi alur sistem dan logika program yang diimplementasikan.*

### 1. Dashboard Web Monitoring (Next.js)
Tampilan antarmuka utama untuk memantau data suhu, kelembaban, dan status aktuator secara real-time.
![Dashboard Web](docs/dashboard-png/Screenshot%202026-02-20%20133436.png)

### 2. Node-RED Flow & Middleware Logic
Alur data dari sensor Tasmota via MQTT yang diolah menggunakan custom JavaScript function node sebelum disimpan ke database MySQL.
![Node-RED Flow](docs/nodered-png/Screenshot%202026-02-20%20133650.png)

### 3. Skema Hardware & Tasmota
Rangkaian mikrokontroler ESP8266 dan konfigurasi firmware Tasmota.
![Hardware Tasmota](docs/tasmota-alat-png/Screenshot%202026-02-20%20133912.png)

---

## Tech Stack & Arsitektur

- **Frontend:** Next.js, React, Tailwind CSS
- **Database & ORM:** MySQL (XAMPP), Prisma ORM
- **IoT & Middleware:** ESP8266 (Tasmota), Node-RED, MQTT Broker

---

## Fitur Utama
- [x] Monitoring Suhu & Kelembaban kumbung jamur secara real-time.
- [x] Otomatisasi kontrol Kipas, Pompa, dan Lampu Penghangat berdasarkan kondisi suhu.
- [x] Pencatatan riwayat data sensor ke database MySQL.
- [x] Antarmuka web responsif berbasis Next.js.

---

## 💻 Cara Menjalankan Secara Lokal (Development)

1. **Clone repository ini:**
   ```bash
   git clone [https://github.com/salsabilaazzz/tiramitech-iot-app.git](https://github.com/salsabilaazzz/tiramitech-iot-app.git)
   cd tiramitech
   npm install
   DATABASE_URL="mysql://root:@localhost:3306/tiramitech.sql"
   npm run dev
   buka pada http://localhost:3000



