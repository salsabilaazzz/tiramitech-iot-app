import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">

      {/* JUDUL */}
      <h1 className="text-5xl font-bold text-blue-900 tracking-wide mb-8">
        TIRAMITECH
      </h1>

      {/* LOGO */}
      <img src="/Rastek.png" alt="Jamur Tiramitech" className="w-64 mb-10 drop-shadow-md" />

      {/* BUTTON */}
      <Link href="/login">
        <button className="bg-blue-700 text-white text-lg font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-blue-800 active:scale-95 transition">
          MULAI LAKUKAN MONITORING
        </button>
      </Link>

    </div>
  );
}
