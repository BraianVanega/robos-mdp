"use client";

import { useState, useCallback, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import {
  getGoogleMapsApiKey,
  getDefaultMapCenter,
  getDefaultZoom,
} from "@/lib/google-maps";
import MapMarker from "./MapMarker";
import ReportForm from "./ReportForm";
import { Denuncia, TipoRobo } from "@/lib/types";

export default function MapContainer() {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Obtener configuración del mapa de forma segura
  const [apiKey, setApiKey] = useState<string>("");
  const [mapConfig, setMapConfig] = useState<{
    center: { lat: number; lng: number };
    zoom: number;
  }>({
    center: { lat: -38.0055, lng: -57.5426 }, // Mar del Plata, Buenos Aires, Argentina
    zoom: 10,
  });

  // Función para cargar denuncias
  const fetchDenuncias = useCallback(async () => {
    try {
      const response = await fetch("/api/denuncias");
      if (response.ok) {
        const data = await response.json();
        // Convertir fechas de string a Date
        const denunciasWithDates = data.map((d: any) => ({
          ...d,
          fecha: new Date(d.fecha),
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        }));
        setDenuncias(denunciasWithDates);
      }
    } catch (error) {
      console.error("Error al obtener denuncias:", error);
      // No mostramos error al usuario, solo en consola
    }
  }, []);

  useEffect(() => {
    // Obtener configuración de forma asíncrona para no bloquear el render
    try {
      const key = getGoogleMapsApiKey();
      const center = getDefaultMapCenter();
      const zoom = getDefaultZoom();
      setApiKey(key);
      setMapConfig({ center, zoom });
    } catch (error) {
      console.error("Error al obtener configuración de Google Maps:", error);
      // Mantener valores por defecto
    }

    // Cargar denuncias después de que el mapa se haya renderizado
    // No bloqueamos el renderizado del mapa
    fetchDenuncias();
  }, [fetchDenuncias]);

  const handleMapClick = useCallback((event: any) => {
    // Manejar diferentes formatos de evento
    let lat: number | null = null;
    let lng: number | null = null;

    if (event.detail?.latLng) {
      lat = event.detail.latLng.lat;
      lng = event.detail.latLng.lng;
    } else if (event.latLng) {
      // Formato alternativo
      lat =
        typeof event.latLng.lat === "function"
          ? event.latLng.lat()
          : event.latLng.lat;
      lng =
        typeof event.latLng.lng === "function"
          ? event.latLng.lng()
          : event.latLng.lng;
    }

    if (lat !== null && lng !== null) {
      setSelectedLocation({ lat, lng });
      setIsFormOpen(true);
    }
  }, []);

  const handleFormSubmit = useCallback(
    async (data: any) => {
      if (!selectedLocation) return;

      try {
        // Determinar tipo basado en modalidad
        let tipo: TipoRobo = data.tipo || "otro";
        if (
          data.modalidad?.includes("Asalto") ||
          data.modalidad?.includes("Mano Armada")
        ) {
          tipo = "asalto";
        } else if (
          data.modalidad?.includes("Robo") &&
          (data.marca || data.modelo)
        ) {
          // Si hay marca/modelo y es robo, puede ser vehículo o bicicleta
          // Por ahora asumimos vehículo, pero se puede mejorar con más lógica
          tipo = "robo_vehiculo";
        } else if (data.modalidad?.includes("Hurto")) {
          tipo = "hurto";
        }

        const response = await fetch("/api/denuncias", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipo: tipo,
            fecha: data.fecha,
            hora: data.hora,
            ubicacion: {
              lat: selectedLocation.lat,
              lng: selectedLocation.lng,
              zona: data.zona,
            },
            marca: data.marca,
            modelo: data.modelo,
            modalidad: data.modalidad,
            descripcion: data.descripcion,
          }),
        });

        if (response.ok) {
          const nuevaDenuncia = await response.json();
          setDenuncias((prev) => [
            ...prev,
            {
              ...nuevaDenuncia,
              fecha: new Date(nuevaDenuncia.fecha),
              createdAt: new Date(nuevaDenuncia.createdAt),
              updatedAt: new Date(nuevaDenuncia.updatedAt),
            },
          ]);
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
    },
    [selectedLocation, fetchDenuncias]
  );

  // Manejo de errores para API key
  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error de Configuración
          </h2>
          <p className="text-gray-600 mb-4">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no está configurada
          </p>
          <p className="text-sm text-gray-500">
            Por favor, configura la variable de entorno
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en tu archivo .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative w-full h-full">
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultCenter={mapConfig.center}
          defaultZoom={mapConfig.zoom}
          onClick={handleMapClick}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {denuncias.map((denuncia) => (
            <MapMarker key={denuncia.id} denuncia={denuncia} />
          ))}
        </Map>

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
