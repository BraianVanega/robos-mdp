"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { getGoogleMapsApiKey, getDefaultMapCenter, getDefaultZoom } from "@/lib/google-maps";
import MapMarker from "./MapMarker";
import HeatmapLayer from "./HeatmapLayer";
import ReportForm from "./ReportForm";
import { Denuncia, TipoRobo } from "@/lib/types";
import { MapPin, Layers } from "lucide-react";

export default function MapContainer() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<TipoRobo | "todos">("todos");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    // Cargar denuncias al montar el componente
    fetchDenuncias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const apiKey = getGoogleMapsApiKey();
  const defaultCenter = getDefaultMapCenter();
  const defaultZoom = getDefaultZoom();

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedLocation({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
      setIsFormOpen(true);
    }
  }, []);

  const handleFormSubmit = useCallback(async (data: any) => {
    if (!selectedLocation) return;
    
    try {
      const response = await fetch("/api/denuncias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: data.tipo,
          fecha: data.fecha,
          ubicacion: selectedLocation,
          descripcion: data.descripcion,
          contacto: data.contacto,
        }),
      });

      if (response.ok) {
        const nuevaDenuncia = await response.json();
        setDenuncias((prev) => [...prev, nuevaDenuncia]);
        setIsFormOpen(false);
        setSelectedLocation(null);
        // Recargar denuncias para asegurar sincronización
        await fetchDenuncias();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "No se pudo crear la denuncia"}`);
      }
    } catch (error) {
      console.error("Error al crear denuncia:", error);
      alert("Error al crear la denuncia. Por favor, intenta nuevamente.");
    }
  }, [selectedLocation]);

  const denunciasFiltradas = useMemo(() => {
    if (filtroTipo === "todos") return denuncias;
    return denuncias.filter((d) => d.tipo === filtroTipo);
  }, [denuncias, filtroTipo]);

  const heatmapData = useMemo(() => {
    return denunciasFiltradas.map((d) => ({
      location: new google.maps.LatLng(d.ubicacion.lat, d.ubicacion.lng),
      weight: 1,
    }));
  }, [denunciasFiltradas]);

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative w-full h-full">
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          onClick={handleMapClick}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {!isHeatmapMode &&
            denunciasFiltradas.map((denuncia) => (
              <MapMarker key={denuncia.id} denuncia={denuncia} />
            ))}
          {isHeatmapMode && <HeatmapLayer data={heatmapData} />}
        </Map>

        {/* Controles */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setIsHeatmapMode(!isHeatmapMode)}
            className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Layers className="w-4 h-4" />
            {isHeatmapMode ? "Vista Normal" : "Vista Heatmap"}
          </button>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as TipoRobo | "todos")}
            className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200"
          >
            <option value="todos">Todos los tipos</option>
            <option value="asalto">Asalto</option>
            <option value="robo_vehiculo">Robo Vehículo</option>
            <option value="robo_celular">Robo Celular</option>
            <option value="robo_bicicleta">Robo Bicicleta</option>
            <option value="hurto">Hurto</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Instrucciones */}
        <div className="absolute bottom-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Haz click en el mapa para reportar un robo
          </p>
        </div>

        {/* Formulario Modal */}
        {isFormOpen && selectedLocation && (
          <ReportForm
            location={selectedLocation}
            onSubmit={handleFormSubmit}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedLocation(null);
            }}
          />
        )}
      </div>
    </APIProvider>
  );
}
