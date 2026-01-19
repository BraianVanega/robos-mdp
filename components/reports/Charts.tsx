"use client";

import { DenunciaStats, TipoRobo } from "@/lib/types";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface ChartsProps {
  stats: DenunciaStats;
  tipoLabels: Record<TipoRobo, string>;
}

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#6b7280"];

export default function Charts({ stats, tipoLabels }: ChartsProps) {
  // Datos para gráfico de barras (tipos de robo)
  const tiposData = Object.entries(stats.porTipo)
    .filter(([_, count]) => count > 0)
    .map(([tipo, count]) => ({
      tipo: tipoLabels[tipo as TipoRobo],
      cantidad: count,
    }));

  // Datos para gráfico de pie
  const pieData = Object.entries(stats.porTipo)
    .filter(([_, count]) => count > 0)
    .map(([tipo, count]) => ({
      name: tipoLabels[tipo as TipoRobo],
      value: count,
    }));

  // Datos para gráfico de líneas (tendencias)
  const tendenciasData = stats.tendencias.map((t) => ({
    fecha: t.fecha,
    cantidad: t.cantidad,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de barras - Tipos de robo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Robos por Tipo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tiposData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pie - Distribución */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Distribución de Robos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de líneas - Tendencias */}
      {tendenciasData.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Tendencias Temporales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tendenciasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cantidad"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Cantidad de Robos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
