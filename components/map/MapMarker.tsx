"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Denuncia, TipoRobo } from "@/lib/types";

interface MapMarkerProps {
  denuncia: Denuncia;
}

// Mapeo de tipos a colores y emojis/símbolos
const tipoConfig: Record<TipoRobo, { color: string; symbol: string }> = {
  robo_bicicleta: {
    color: "#ef4444", // rojo
    symbol: "🚲",
  },
  asalto: {
    color: "#10b981", // verde
    symbol: "⚠️",
  },
  hurto: {
    color: "#10b981", // verde
    symbol: "⚠️",
  },
  robo_vehiculo: {
    color: "#f59e0b", // amarillo
    symbol: "💀",
  },
  robo_celular: {
    color: "#3b82f6", // azul
    symbol: "⚠️",
  },
  otro: {
    color: "#6b7280", // gris
    symbol: "⚠️",
  },
};

export default function MapMarker({ denuncia }: MapMarkerProps) {
  const config = tipoConfig[denuncia.tipo] || tipoConfig.otro;

  return (
    <AdvancedMarker
      position={{ lat: denuncia.ubicacion.lat, lng: denuncia.ubicacion.lng }}
    >
      <div
        className="flex items-center justify-center rounded-full border-2 border-white shadow-lg text-lg"
        style={{
          backgroundColor: config.color,
          width: "36px",
          height: "36px",
        }}
      >
        {config.symbol}
      </div>
    </AdvancedMarker>
  );
}
