import { NextRequest, NextResponse } from "next/server";
import { DenunciaStats, TipoRobo, Denuncia } from "@/lib/types";
import { readDenuncias } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    // Leer denuncias del archivo JSON
    const denuncias: Denuncia[] = readDenuncias();

    // Calcular estadísticas
    const total = denuncias.length;

    const porTipo: Record<TipoRobo, number> = {
      asalto: 0,
      robo_vehiculo: 0,
      robo_celular: 0,
      robo_bicicleta: 0,
      hurto: 0,
      otro: 0,
    };

    denuncias.forEach((d) => {
      if (d.tipo in porTipo) {
        porTipo[d.tipo as TipoRobo]++;
      }
    });

    // Calcular zonas calientes (agrupación por proximidad)
    const zonasCalientes = calcularZonasCalientes(denuncias);

    // Calcular tendencias temporales
    const tendencias = calcularTendencias(denuncias);

    const stats: DenunciaStats = {
      total,
      porTipo,
      zonasCalientes,
      tendencias,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error al obtener las estadísticas" },
      { status: 500 }
    );
  }
}

function calcularZonasCalientes(denuncias: Denuncia[]): Array<{
  lat: number;
  lng: number;
  cantidad: number;
  radio: number;
}> {
  // Algoritmo simple de agrupación por proximidad
  const zonas: Array<{
    lat: number;
    lng: number;
    cantidad: number;
    radio: number;
  }> = [];

  const RADIO_AGRUPACION = 0.01; // ~1km

  denuncias.forEach((denuncia) => {
    const { lat, lng } = denuncia.ubicacion;

    // Buscar si existe una zona cercana
    let zonaEncontrada = false;
    for (const zona of zonas) {
      const distancia = Math.sqrt(
        Math.pow(lat - zona.lat, 2) + Math.pow(lng - zona.lng, 2)
      );

      if (distancia < RADIO_AGRUPACION) {
        // Actualizar zona existente
        zona.cantidad++;
        zona.lat = (zona.lat * (zona.cantidad - 1) + lat) / zona.cantidad;
        zona.lng = (zona.lng * (zona.cantidad - 1) + lng) / zona.cantidad;
        zonaEncontrada = true;
        break;
      }
    }

    // Crear nueva zona si no se encontró una cercana
    if (!zonaEncontrada) {
      zonas.push({
        lat,
        lng,
        cantidad: 1,
        radio: RADIO_AGRUPACION,
      });
    }
  });

  // Ordenar por cantidad y retornar top 10
  return zonas
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10);
}

function calcularTendencias(denuncias: Denuncia[]): Array<{
  fecha: string;
  cantidad: number;
}> {
  const tendenciasMap = new Map<string, number>();

  denuncias.forEach((denuncia) => {
    const fecha = new Date(denuncia.fecha);
    const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;

    tendenciasMap.set(clave, (tendenciasMap.get(clave) || 0) + 1);
  });

  return Array.from(tendenciasMap.entries())
    .map(([fecha, cantidad]) => ({ fecha, cantidad }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}
