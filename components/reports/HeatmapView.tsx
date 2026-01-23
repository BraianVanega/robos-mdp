"use client";

import { useEffect, useState, useMemo } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { getGoogleMapsApiKey, getDefaultMapCenter, getDefaultZoom } from "@/lib/google-maps";
import { Denuncia } from "@/lib/types";
import HeatmapLayer from "@/components/map/HeatmapLayer";

export default function HeatmapView() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const apiKey = getGoogleMapsApiKey();
  const defaultCenter = getDefaultMapCenter();
  const defaultZoom = getDefaultZoom();

  useEffect(() => {
    fetchDenuncias();
  }, []);

  const fetchDenuncias = async () => {
    try {
      const response = await fetch("/api/denuncias");
      if (response.ok) {
        const data = await response.json();
        setDenuncias(data);
      }
    } catch (error) {
      console.error("Error al obtener denuncias:", error);
    }
  };

  const heatmapData = useMemo(() => {
    return denuncias.map((d) => ({
      location: { lat: d.ubicacion.lat, lng: d.ubicacion.lng },
      weight: 1,
    }));
  }, [denuncias]);

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        <HeatmapLayer data={heatmapData} />
      </Map>
    </APIProvider>
  );
}
