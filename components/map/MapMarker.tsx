"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Denuncia, TipoRobo } from "@/lib/types";

interface MapMarkerProps {
  denuncia: Denuncia;
}

const tipoColors: Record<TipoRobo, string> = {
  asalto: "#ef4444", // red
  robo_vehiculo: "#f59e0b", // amber
  robo_celular: "#3b82f6", // blue
  robo_bicicleta: "#10b981", // green
  hurto: "#8b5cf6", // purple
  otro: "#6b7280", // gray
};

export default function MapMarker({ denuncia }: MapMarkerProps) {
  const color = tipoColors[denuncia.tipo] || tipoColors.otro;

  return (
    <AdvancedMarker
      position={{ lat: denuncia.ubicacion.lat, lng: denuncia.ubicacion.lng }}
    >
      <Pin
        background={color}
        glyphColor="#ffffff"
        borderColor="#ffffff"
        scale={1.2}
      />
    </AdvancedMarker>
  );
}
