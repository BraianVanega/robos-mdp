"use client";
import dynamic from "next/dynamic";
// Lazy load map component (client-side only)
const DynamicMapContainer = dynamic(
  () => import("@/components/map/MapContainer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    ),
  }
);

export default DynamicMapContainer;
