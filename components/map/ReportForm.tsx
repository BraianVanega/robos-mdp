"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
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
  hora: z.string().min(1, "La hora es requerida"),
  descripcion: z.string().optional(),
  contacto: z
    .object({
      email: z.string().email().optional().or(z.literal("")),
      telefono: z.string().optional(),
    })
    .optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ReportFormProps {
  location: { lat: number; lng: number };
  onSubmit: (data: ReportFormData) => void;
  onClose: () => void;
}

const tipoLabels: Record<TipoRobo, string> = {
  asalto: "Asalto",
  robo_vehiculo: "Robo de Vehículo",
  robo_celular: "Robo de Celular",
  robo_bicicleta: "Robo de Bicicleta",
  hurto: "Hurto",
  otro: "Otro",
};

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
      hora: new Date().toTimeString().slice(0, 5),
    },
  });

  const onSubmitForm = async (data: ReportFormData) => {
    const fechaCompleta = new Date(`${data.fecha}T${data.hora}`);
    onSubmit({
      ...data,
      fecha: fechaCompleta.toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Reportar Robo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Robo *
            </label>
            <select
              {...register("tipo")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(tipoLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                {...register("fecha")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fecha && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fecha.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora *
              </label>
              <input
                type="time"
                {...register("hora")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.hora && (
                <p className="mt-1 text-sm text-red-600">{errors.hora.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              {...register("descripcion")}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe lo que sucedió..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contacto (opcional)
            </label>
            <div className="space-y-2">
              <input
                type="email"
                {...register("contacto.email")}
                placeholder="Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                {...register("contacto.telefono")}
                placeholder="Teléfono"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar Denuncia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
