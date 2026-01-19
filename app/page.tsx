import Link from "next/link";
import { MapContainer } from "./components";

export default function HomePage() {
  return (
    <main className="h-screen w-screen relative">
      <MapContainer />
      <Link
        href="/reportes"
        className="absolute top-4 right-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <span>Ver Reportes</span>
      </Link>
    </main>
  );
}
