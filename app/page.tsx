import dynamic from "next/dynamic";
import Link from "next/link";

// Lazy load map component (client-side only)
const DynamicMapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return (
    <main className="h-screen w-screen relative">
      <DynamicMapContainer />
      <Link
        href="/reportes"
        className="absolute top-4 right-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <span>Ver Reportes</span>
      </Link>
    </main>
  );
}
