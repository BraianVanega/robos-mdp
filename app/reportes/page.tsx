"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DenunciaStats, TipoRobo } from "@/lib/types";
import StatsCard from "@/components/reports/StatsCard";
import Charts from "@/components/reports/Charts";
import dynamic from "next/dynamic";
import { BarChart3, TrendingUp, MapPin, ArrowLeft } from "lucide-react";

const DynamicHeatmapView = dynamic(
  () => import("@/components/reports/HeatmapView"),
  { ssr: false }
);

const tipoLabels: Record<TipoRobo, string> = {
  asalto: "Asalto",
  robo_vehiculo: "Robo Vehículo",
  robo_celular: "Robo Celular",
  robo_bicicleta: "Robo Bicicleta",
  hurto: "Hurto",
  otro: "Otro",
};

export default function ReportesPage() {
  const [stats, setStats] = useState<DenunciaStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/denuncias/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Mapa</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Reportes y Estadísticas
        </h1>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total de Robos"
            value={stats.total}
            icon={<BarChart3 className="w-6 h-6" />}
            description="Denuncias registradas"
          />
          <StatsCard
            title="Tipos de Robo"
            value={Object.keys(stats.porTipo).filter(
              (tipo) => stats.porTipo[tipo as TipoRobo] > 0
            ).length}
            icon={<TrendingUp className="w-6 h-6" />}
            description="Categorías diferentes"
          />
          <StatsCard
            title="Zonas Calientes"
            value={stats.zonasCalientes.length}
            icon={<MapPin className="w-6 h-6" />}
            description="Áreas identificadas"
          />
        </div>

        {/* Gráficos */}
        <div className="mb-8">
          <Charts stats={stats} tipoLabels={tipoLabels} />
        </div>

        {/* Mapa de calor */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mapa de Calor</h2>
          <div className="h-[500px] rounded-lg overflow-hidden">
            <DynamicHeatmapView />
          </div>
        </div>

        {/* Zonas calientes */}
        {stats.zonasCalientes.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Zonas Calientes</h2>
            <div className="space-y-3">
              {stats.zonasCalientes.map((zona, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      Zona {index + 1} - {zona.cantidad} denuncias
                    </p>
                    <p className="text-sm text-gray-600">
                      Lat: {zona.lat.toFixed(4)}, Lng: {zona.lng.toFixed(4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {zona.cantidad} casos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
