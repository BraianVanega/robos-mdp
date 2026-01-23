"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Calendar, Clock, Bike } from "lucide-react";
import { TipoRobo } from "@/lib/types";

const reportSchema = z.object({
  tipo: z.enum([
    "asalto",
    "robo_vehiculo",
    "robo_celular",
    "robo_bicicleta",
    "hurto",
    "otro",
  ]),
  fecha: z.string().min(1, "La fecha es requerida"),
  hora: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  modalidad: z.string().optional(),
  zona: z.string().optional(),
  descripcion: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ReportFormProps {
  location: { lat: number; lng: number };
  onSubmit: (data: ReportFormData) => void;
  onClose: () => void;
}

const marcasComunes = [
  "Selecciona Marca...",
  "Tornado",
  "Yamaha",
  "Honda",
  "Bajaj",
  "Zanella",
  "Corven",
  "Gilera",
  "Motomel",
  "Otra",
];

const modalidades = [
  "Mano Armada (Asalto)",
  "Robo",
  "Hurto",
  "Intento de Robo",
  "Otro",
];

export default function ReportForm({
  location,
  onSubmit,
  onClose,
}: ReportFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0],
      hora: "",
    },
  });

  const onSubmitForm = async (data: ReportFormData) => {
    const fechaCompleta = data.hora
      ? new Date(`${data.fecha}T${data.hora}`)
      : new Date(data.fecha);
    onSubmit({
      ...data,
      fecha: fechaCompleta.toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bike className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold">Reportar Robo</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-4">
          {/* TIPO DE ROBO (oculto, se determina automáticamente) */}
          <input type="hidden" {...register("tipo")} value="otro" />

          {/* FECHA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FECHA
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("fecha")}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.fecha && (
              <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
            )}
          </div>

          {/* HORA APROX. */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HORA APROX.
            </label>
            <div className="relative">
              <input
                type="time"
                {...register("hora")}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="--:--"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* MARCA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MARCA
            </label>
            <select
              {...register("marca")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {marcasComunes.map((marca) => (
                <option key={marca} value={marca === "Selecciona Marca..." ? "" : marca}>
                  {marca}
                </option>
              ))}
            </select>
          </div>

          {/* MODELO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MODELO
            </label>
            <input
              type="text"
              {...register("modelo")}
              placeholder="Ej: Tornado 250, MT-03"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* MODALIDAD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MODALIDAD
            </label>
            <select
              {...register("modalidad")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {modalidades.map((modalidad) => (
                <option key={modalidad} value={modalidad}>
                  {modalidad}
                </option>
              ))}
            </select>
          </div>

          {/* ZONA / BARRIO / LOCALIDAD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZONA / BARRIO / LOCALIDAD
            </label>
            <input
              type="text"
              {...register("zona")}
              placeholder="Nueva Pompeya, Mar del Plata, Buenos Aires"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Si dejas vacío, se autocompletará con la ubicación del mapa.
            </p>
          </div>

          {/* COMENTARIO ADICIONAL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              COMENTARIO ADICIONAL
            </label>
            <textarea
              {...register("descripcion")}
              rows={4}
              placeholder="Detalles extra..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Botones */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? "Enviando..." : "REPORTAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
