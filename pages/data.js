// // pages/data.js
// import { getDB } from "../lib/db.js";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
// import { useRouter } from "next/router";

// // Ambil data dari MySQL
// export async function getServerSideProps() {
//   const db = await getDB();

//   // ambil semua data monitoring
//   const [rows] = await db.execute(
//     "SELECT * FROM monitoring ORDER BY tanggal DESC LIMIT 3"
//   );

//   console.log("DB Result:", rows); // debug di terminal

//   // contoh data panen dummy (nanti bisa ambil dari DB juga)
//   const harvestData = [
//     { bulan: "JANUARI", panen: 12 },
//     { bulan: "FEBRUARI", panen: 3 },
//     { bulan: "MARET", panen: 10 },
//     { bulan: "APRIL", panen: 7 },
//   ];

//   await db.end();

//   return {
//     props: {
//       latest: rows || [], // kasih default biar gak undefined
//       harvestData,
//     },
//   };
// }

// export default function Data({ latest = [], harvestData = [] }) {
//   const router = useRouter();

//   return (
//     <div className="min-h-screen bg-blue-100 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-blue-900">
//           LOG DATA KUMBUNG JAMUR TIRAM
//         </h1>
//         <button
//           onClick={() => router.push("/")}
//           className="text-3xl text-blue-900"
//         >
//           &#9776;
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Tabel */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-400 bg-white rounded-lg shadow">
//             <thead className="bg-blue-300 text-blue-900">
//               <tr>
//                 <th className="py-2 px-4 border">RATA RATA SUHU RUANG</th>
//                 <th className="py-2 px-4 border">RATA RATA KELEMBABAN</th>
//                 <th className="py-2 px-4 border">STATUS JAMUR</th>
//               </tr>
//             </thead>
//             <tbody>
//               {latest.length > 0 ? (
//                 latest.map((item, idx) => (
//                   <tr key={idx} className="text-center">
//                     <td className="py-2 px-4 border">{item.suhu}</td>
//                     <td className="py-2 px-4 border">{item.kelembaban}</td>
//                     <td className="py-2 px-4 border">{item.status_jamur || "-"}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="text-center py-4">
//                     Belum ada data
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Tombol Unduh */}
//           <div className="mt-4">
//             <a
//               href="/api/export-xlsx"
//               className="text-blue-900 font-bold underline"
//             >
//               UNDUH DATA SEBAGAI .XLSX
//             </a>
//           </div>
//         </div>

//         {/* Grafik Panen */}
//         <div className="bg-white p-4 rounded-lg shadow">
//           <h2 className="text-center text-blue-900 font-bold mb-4">
//             DATA PANEN
//           </h2>
//           <BarChart width={350} height={250} data={harvestData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="bulan" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="panen" fill="#2563eb" />
//           </BarChart>
//         </div>
//       </div>
//     </div>
//   );
// }
