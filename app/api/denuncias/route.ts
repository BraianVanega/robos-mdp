import { NextRequest, NextResponse } from "next/server";
import { CreateDenunciaInput, Denuncia } from "@/lib/types";
import { validateCoordinates } from "@/lib/utils";
import { denunciasStore } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body: CreateDenunciaInput = await request.json();

    // Validar coordenadas
    if (
      !validateCoordinates(body.ubicacion.lat, body.ubicacion.lng)
    ) {
      return NextResponse.json(
        { error: "Coordenadas inválidas" },
        { status: 400 }
      );
    }

    // Crear nueva denuncia
    const nuevaDenuncia: Denuncia = {
      id: `denuncia-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tipo: body.tipo,
      fecha: new Date(body.fecha),
      ubicacion: body.ubicacion,
      descripcion: body.descripcion,
      estado: "pendiente",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Guardar en CMS aquí
    // Ejemplo para Prismic:
    // await prismicClient.create('denuncia', { ... })
    // Ejemplo para Contentstack:
    // await contentstackClient.contentType('denuncia').entry().create({ ... })

    denunciasStore.push(nuevaDenuncia);

    return NextResponse.json(nuevaDenuncia, { status: 201 });
  } catch (error) {
    console.error("Error al crear denuncia:", error);
    return NextResponse.json(
      { error: "Error al procesar la denuncia" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get("tipo");
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");

    let denuncias = [...denunciasStore];

    // Filtros
    if (tipo && tipo !== "todos") {
      denuncias = denuncias.filter((d) => d.tipo === tipo);
    }

    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      denuncias = denuncias.filter((d) => d.fecha >= desde);
    }

    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      denuncias = denuncias.filter((d) => d.fecha <= hasta);
    }

    // TODO: Obtener desde CMS aquí
    // Ejemplo para Prismic:
    // const denuncias = await prismicClient.getAllByType('denuncia', { ... })
    // Ejemplo para Contentstack:
    // const denuncias = await contentstackClient.contentType('denuncia').entry().query({ ... }).find()

    return NextResponse.json(denuncias, { status: 200 });
  } catch (error) {
    console.error("Error al obtener denuncias:", error);
    return NextResponse.json(
      { error: "Error al obtener las denuncias" },
      { status: 500 }
    );
  }
}
