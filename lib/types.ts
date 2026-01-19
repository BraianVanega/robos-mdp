export interface Denuncia {
  id: string;
  tipo: TipoRobo;
  fecha: Date;
  ubicacion: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  descripcion?: string;
  estado: "pendiente" | "verificada" | "rechazada";
  createdAt: Date;
  updatedAt: Date;
}

export type TipoRobo =
  | "asalto"
  | "robo_vehiculo"
  | "robo_celular"
  | "robo_bicicleta"
  | "hurto"
  | "otro";

export interface CreateDenunciaInput {
  tipo: TipoRobo;
  fecha: string;
  ubicacion: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  descripcion?: string;
  contacto?: {
    email?: string;
    telefono?: string;
  };
}

export interface DenunciaStats {
  total: number;
  porTipo: Record<TipoRobo, number>;
  zonasCalientes: Array<{
    lat: number;
    lng: number;
    cantidad: number;
    radio: number;
  }>;
  tendencias: Array<{
    fecha: string;
    cantidad: number;
  }>;
}
